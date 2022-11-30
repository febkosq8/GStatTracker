import React from "react";
import "./Repo.scss";
import { useEffect, useContext } from "react";
import APIHandler from "../../handlers/APIHandler";
import Event from "../../providers/EventProvider";
import Loading from "../../components/Loading";
import { useMutation, useQuery } from "@tanstack/react-query";
import Configuration from "../../providers/ConfigProvider";
import randomColor from "randomcolor";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";
import DateHandler from "../../handlers/DateHandler";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlagHandler from "../../handlers/FlagHandler";
import InfoHandler from "../../handlers/InfoHandler";
import useUserInfo from "../../providers/UserProvider";

function Repo() {
	document.title = "Repository Query | GStat Tracker";
	const { user, loading, isAdmin, logout } = useUserInfo();
	const EventHandler = useContext(Event);
	const DefaultConfig = useContext(Configuration);
	const Config = useContext(Configuration);
	const [repoUrl, setRepoUrl] = React.useState(new URLSearchParams(document.location.search).get("repoUrl") ?? "");
	const repoFormRef = React.useRef(null);
	const repoInputRef = React.useRef(null);
	const activeTime = React.useState(DefaultConfig.getConfig("activeTime"));
	const [fetchListData, setFetchListData] = React.useState(false);
	const { isLoading: repoDataLoading, data: repoData } = useQuery(
		["repo", repoUrl],
		() => APIHandler.getRepoData(repoUrl, Config.getConfig("logTime")),
		{
			onSuccess: (data) => {
				if (repoUrl !== "" && data.error) {
					EventHandler.publish("toast", {
						message: data.error,
						type: "danger"
					});
				}
				if (repoUrl !== "" && data.isCached == true) {
					EventHandler.publish("toast", {
						message: InfoHandler.getInfo("fetchedCache"),
						type: "info"
					});
				}
				setFetchListData(false);
			},
			refetchOnWindowFocus: false,
			enabled: repoUrl !== "" && fetchListData
		}
	);
	useEffect(() => {
		repoInputRef.current.value = repoUrl;
		if (repoUrl !== "") {
			handleSubmit();
		}
	}, []);

	const handleSubmit = async (e) => {
		e?.preventDefault();
		setFetchListData(true);
		setRepoUrl((curr) => repoInputRef.current.value);
	};

	return (
		<div className='d-flex flex-column justify-content-center align-items-center h-100 transition p-3 col'>
			<form
				ref={repoFormRef}
				className='primary-color needs-validation col-sm-12 col-md-6'
				onSubmit={handleSubmit}>
				<label className='primary-color form-label'>
					Search for repository details
					<FontAwesomeIcon className='infoIcon' title={InfoHandler.getInfo("repoPage")} icon={faCircleInfo} />
				</label>
				<div className='input-group w-100'>
					<h6 className='dark-background primary-color text-decoration-none mb-0 input-group-text d-sm-none d-md-flex'>
						github.com/
					</h6>
					<input
						className='form-control dark-background primary-color'
						ref={repoInputRef}
						type='text'
						name='repoUrl'
						title='Enter the GitHub Repository Directory'
						placeholder='GitHub Repo Directory'
						required
					/>
					<button type='submit' className='btn btn-primary' style={{ width: "5rem" }}>
						{fetchListData ? <Loading type='light' size='sm' /> : "Search"}
					</button>
				</div>
			</form>
			{!repoDataLoading && !!repoData?.repoName && repoData.repoUrl ? (
				<div className='dark-background primary-border primary-color card p-4 mt-5 col-sm-12 col-md-6'>
					<div className='d-flex flex-row justify-content-between'>
						<p>
							<strong>Repository Name : </strong> <a href={repoData.repoUrl}>{repoData.repoName}</a>
						</p>
						<h6 title={InfoHandler.getInfo(FlagHandler.getActiveType(repoData.lastCommitOn, activeTime))}>
							{FlagHandler.getFlag(repoData.lastCommitOn, activeTime)}
						</h6>
					</div>
					<p>
						<strong>Created by : </strong>
						<a href={`/user?username=${repoData.createdBy}`}>{repoData.createdBy}</a>
					</p>
					<p
						data-date={DateHandler.getTimeAgo(new Date(repoData.createdAt).toISOString())}
						className='tooltip-custom'>
						<strong>Created at : </strong>
						{new Date(repoData.createdAt).toLocaleString()}
					</p>
					<p
						data-date={DateHandler.getTimeAgo(new Date(repoData.lastCommitOn).toISOString())}
						className='tooltip-custom'>
						<strong>Last Commit on : </strong>
						{new Date(repoData.lastCommitOn).toLocaleString()}
					</p>
					<p>
						<strong>Languages : </strong>
						<span>
							{!repoData?.languages["error"]
								? Object.entries(repoData?.languages)
										.map(([key, value]) => {
											return `${key} : ${((value / repoData?.totalBytes) * 100).toFixed(2)}%`;
										})
										.join(", ")
								: "Not Available"}
						</span>
					</p>

					<div className='mb-3'>
						<strong>Contributors :</strong>
						{repoData.contributors.length > 0 ? (
							<>
								<button
									className='btn btn-sm btn-primary ms-2 '
									style={{ height: "fit-content" }}
									data-bs-toggle='collapse'
									data-bs-target='#contributors'
									aria-controls='contributors'>
									Show/Hide
								</button>
								<div id='contributors' className='collapse'>
									<ResponsiveContainer width='100%' height={400}>
										<PieChart height={300}>
											<Pie
												data={repoData.contributors.map((contributor) => {
													return { ...contributor, fill: randomColor() };
												})}
												cx='50%'
												cy='50%'
												outerRadius={80}
												dataKey='commits'
											/>
											<Legend />
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
								</div>
							</>
						) : (
							" Not Available"
						)}
					</div>
					<p>
						<strong>Total Commits : </strong>
						<a href={`/repocommit?repoUrl=${repoUrl}`}>{repoData.totalCommits}</a>
					</p>
					<p>
						<strong>Analyze : </strong>
						{user ? (
							<>
								<a href={`/analyze?repoUrl=${repoUrl}`}>Click Here</a>
							</>
						) : (
							<>Login Required</>
						)}
					</p>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default Repo;
