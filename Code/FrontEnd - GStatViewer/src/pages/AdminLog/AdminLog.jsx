import React, { useEffect, useState, useContext } from "react";
import "./AdminLog.scss";
import { useNavigate } from "react-router-dom";
import APIHandler from "../../handlers/APIHandler";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import randomColor from "randomcolor";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, LineChart, Line, XAxis, YAxis } from "recharts";
import Accordion from "../../components/Accordion";
import DateHandler from "../../handlers/DateHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import FlagHandler from "../../handlers/FlagHandler";
import useUserInfo from "../../providers/UserProvider";

function AdminLog() {
	document.title = "Admin Log | GStat Tracker";
	const { user, loading, isAdmin, logout } = useUserInfo();
	const queryClient = useQueryClient();
	const EventHandler = useContext(Event);
	const [logType, setLogType] = useState();
	const Nav = useNavigate();
	const { isLoading: countLoading, data: countData } = useQuery(["logCount"], APIHandler.getLogsCount, {
		onSuccess: (data) => {
			if (data.error) {
				EventHandler.publish("toast", {
					message: data.error,
					type: "danger"
				});
			}
		},
		enabled: isAdmin && !loading
	});
	const { isLoading: logLoading, data: logData } = useQuery(["log", logType], () => APIHandler.logQuery(logType), {
		onSuccess: () => {
			queryClient.invalidateQueries(["logCount"]);
		},
		enabled: isAdmin && !loading
	});
	if (loading) {
		return <Loading />;
	}
	if (!isAdmin) {
		window.location.pathname = "/fail";
	}

	return (
		<div className='d-flex flex-column'>
			<div className='row g-2 gap-2 mx-auto my-3'>
				<button
					className='card alternate-background primary-border col-sm-12 col-md-auto d-flex flex-column align-items-center justify-content-center'
					onClick={() => {
						setLogType((curr) => "user");
					}}>
					<div className=' card-body '>
						<h5 className='card-title border-bottom border-dark text-light '>User Log Instances</h5>
						<h6 className='card-text fw-bolder text-light'>
							{countLoading ? "Loading..." : countData?.userCount}
						</h6>
					</div>
				</button>
				<button
					className='card alternate-background primary-border col-sm-12 col-md-auto d-flex flex-column align-items-center justify-content-center'
					onClick={() => {
						setLogType((curr) => "repo");
					}}>
					<div className='card-body'>
						<h5 className='card-title border-bottom border-dark text-light'>Repository Log Instances</h5>
						<h6 className='card-text fw-bolder text-light'>
							{countLoading ? "Loading..." : countData?.repoCount}
						</h6>
					</div>
				</button>
				<button
					className='card alternate-background primary-border col-sm-12 col-md-auto d-flex flex-column align-items-center justify-content-center'
					onClick={() => {
						setLogType((curr) => "bulkRepo");
					}}>
					<div className='card-body'>
						<h5 className='card-title border-bottom border-dark text-light'>
							Bulk Repository Log Instances
						</h5>
						<h6 className='card-text fw-bolder text-light'>
							{countLoading ? "Loading..." : countData?.bulkRepoCount}
						</h6>
					</div>
				</button>
				<button
					className='card alternate-background primary-border col-sm-12 col-md-auto d-flex flex-column align-items-center justify-content-center'
					onClick={() => {
						setLogType((curr) => "commit");
					}}>
					<div className='card-body'>
						<h5 className='card-title border-bottom border-dark text-light'>
							Individual Commit Log Instances
						</h5>
						<h6 className='card-text fw-bolder text-light'>
							{countLoading ? "Loading..." : countData?.commitCount}
						</h6>
					</div>
				</button>
				<button
					className='card alternate-background primary-border col-sm-12 col-md-auto d-flex flex-column align-items-center justify-content-center'
					onClick={() => {
						setLogType((curr) => "repoCommit");
					}}>
					<div className='card-body'>
						<h5 className='card-title border-bottom border-dark text-light'>
							Repository Commit's Log Instances
						</h5>
						<h6 className='card-text fw-bolder text-light'>
							{countLoading ? "Loading..." : countData?.repoCommitCount}
						</h6>
					</div>
				</button>
				<button
					className='card alternate-background primary-border col-sm-12 col-md-auto d-flex flex-column align-items-center justify-content-center'
					onClick={() => {
						setLogType((curr) => "analyze");
					}}>
					<div className='card-body'>
						<h5 className='card-title border-bottom border-dark text-light'>
							Analyze Repository Log Instances
						</h5>
						<h6 className='card-text fw-bolder text-light'>
							{countLoading ? "Loading..." : countData?.analyzeCount}
						</h6>
					</div>
				</button>
				<button
					className='card alternate-background primary-border col-sm-12 col-md-auto d-flex flex-column align-items-center justify-content-center'
					onClick={() => {
						setLogType((curr) => "loggedUsers");
					}}>
					<div className='card-body'>
						<h5 className='card-title border-bottom border-dark text-light'>Logged Users Log Instances</h5>
						<h6 className='card-text fw-bolder text-light'>
							{countLoading ? "Loading..." : countData?.loggedUserCount}
						</h6>
					</div>
				</button>
				<button className='card alternate-background primary-border col-sm-12 col-md-auto d-flex flex-column align-items-center justify-content-center pe-none'>
					<div className='card-body'>
						<h5 className='card-title border-bottom border-dark text-light'>Total Log Instances</h5>
						<h6 className='card-text fw-bolder text-light'>
							{countLoading ? "Loading..." : countData?.totalCount}
						</h6>
					</div>
				</button>
			</div>
			<div className='container-md'>
				{logType === "user" &&
					(logLoading ? (
						<Loading type='primary' />
					) : (
						<div className='card alternate-background primary-border mt-4'>
							<div className='card-body primary-color d-flex flex-column gap-3'>
								<div className='card-body'>
									<p className='card-title'>User Log</p>
									<p className='card-subtitle mb-2 fw-light'>
										Log Instance Count : {logData?.length}
									</p>
								</div>

								{logData?.map((log) => (
									<Accordion
										data={[
											{
												title: (
													<div className='d-flex lh-1 w-100 pe-4 align-items-center flex-row justify-content-between'>
														<p className='pt-3'>{log.userId}</p>
														<p
															data-date={DateHandler.getTimeAgo(
																new Date(log.timeStamp).toISOString()
															)}
															className='pt-3 tooltip-custom'>
															{new Date(log.timeStamp).toLocaleString()}
														</p>{" "}
													</div>
												),
												content: (
													<div className='w-100'>
														<div className='list-group-item rounded-4 m-2' key={log._id}>
															<p>
																<strong className='mr-2'>Logged In User : </strong>
																{log.loggedInUser}
															</p>
															<p>
																<strong className='mr-2'>Username : </strong>
																{log.userId} /
																<strong className='mr-2'>
																	{" "}
																	User Repository Count :{" "}
																</strong>
																{log.repoCount} /
																<strong className='mr-2'>
																	{" "}
																	Max Entries Per Page :{" "}
																</strong>
																{log.perPage} /
																<strong className='mr-2'> Page No: </strong>
																{log.page}
															</p>
															<p>
																<strong>Name :</strong>{" "}
																{log.name ? log.name : "Not Available"} /{" "}
																<strong>User ID :</strong> {log.id} /{" "}
																<strong>Followers :</strong> {log.followers} /{" "}
																<strong>Following :</strong> {log.following}
															</p>
															<p
																data-date={DateHandler.getTimeAgo(
																	new Date(log.createdAt).toISOString()
																)}
																className='tooltip-custom'>
																<strong>Profile Creation Date :</strong>{" "}
																{new Date(log.createdAt).toLocaleString()}
															</p>
															<h6
																data-date={DateHandler.getTimeAgo(
																	new Date(log.timeStamp).toISOString()
																)}
																className='tooltip-custom'>
																<strong className='mr-2'>Timestamp : </strong>
																{new Date(log.timeStamp).toLocaleString()}
															</h6>
															{log?.repos.length > 0 ? (
																<>
																	<ul
																		className='list-group gap-2'
																		style={{
																			height: "13.5rem",
																			overflowY: "auto"
																		}}>
																		{log.repos.map((repo) => (
																			<li className='list-group-item alternate-background primary-color border border-dark'>
																				<div
																					className='text-bg-light` my-4 ps-3'
																					key={repo.id}>
																					<p>
																						<strong>Repository : </strong>{" "}
																						{repo.repoName}
																					</p>
																					<p>
																						<strong>Visibility : </strong>
																						{repo.repoPrivate
																							? "Private"
																							: "Public"}
																					</p>
																					<p
																						data-date={DateHandler.getTimeAgo(
																							new Date(
																								repo.createdAt
																							).toISOString()
																						)}
																						className='tooltip-custom'>
																						<strong>Created at : </strong>
																						{new Date(
																							repo.createdAt
																						).toLocaleString()}
																					</p>
																					<p>
																						<strong>Description : </strong>{" "}
																						{repo.repoDescription
																							? repo.repoDescription
																							: "Not Available"}
																					</p>
																					<p>
																						<strong>URL : </strong>{" "}
																						{repo.repoUrl}
																					</p>
																				</div>
																			</li>
																		))}
																	</ul>
																</>
															) : (
																<strong>No Repository Data Available</strong>
															)}
														</div>
													</div>
												)
											}
										]}
										className='w-100'
									/>
								))}
							</div>
						</div>
					))}
				{logType === "repo" &&
					(logLoading ? (
						<Loading type='primary' />
					) : (
						<div className='card alternate-background primary-border mt-4 '>
							<div className='card-body primary-color d-flex flex-column gap-3'>
								<div className='card-body'>
									<p className='card-title'>Repository Log</p>
									<p className='card-subtitle mb-2 fw-light'>
										Log Instance Count : {logData?.length}
									</p>
								</div>
								{logData?.map((log) => (
									<Accordion
										data={[
											{
												title: (
													<div className='d-flex lh-1 w-100 pe-4 align-items-center flex-row justify-content-between'>
														<p className='pt-3'>{log.repo}</p>
														<p
															data-date={DateHandler.getTimeAgo(
																new Date(log.timeStamp).toISOString()
															)}
															className='pt-3 tooltip-custom'>
															{new Date(log.timeStamp).toLocaleString()}
														</p>{" "}
													</div>
												),
												content: (
													<div className='w-100'>
														<div className='list-group-item rounded-4 m-2' key={log._id}>
															<p>
																<strong className='mr-2'>Logged In User : </strong>
																{log.loggedInUser}
															</p>
															<p>
																<strong className='mr-2'>Repository : </strong>
																{log.repo}
															</p>
															<h6
																data-date={DateHandler.getTimeAgo(
																	new Date(log.timeStamp).toISOString()
																)}
																className='tooltip-custom'>
																<strong className='mr-2'>Timestamp : </strong>
																{new Date(log.timeStamp).toLocaleString()}
															</h6>
															<div className='card p-3 alternate-background primary-color border border-dark'>
																<p>
																	<strong>Repository Name :</strong> {log.repoName}
																</p>
																<p>
																	<strong>Created by :</strong> {log.createdBy}
																</p>
																<p
																	data-date={DateHandler.getTimeAgo(
																		new Date(log.createdAt).toISOString()
																	)}
																	className='tooltip-custom'>
																	<strong>Created at :</strong>{" "}
																	{new Date(log.createdAt).toLocaleString()}
																</p>
																<p
																	data-date={DateHandler.getTimeAgo(
																		new Date(log.lastCommitOn).toISOString()
																	)}
																	className='tooltip-custom'>
																	<strong>Last Commit on :</strong>{" "}
																	{new Date(log.lastCommitOn).toLocaleString()}
																</p>
																<p>
																	<strong>Languages : </strong>
																	<span>
																		{!log?.languages["error"]
																			? Object.entries(log?.languages)
																					.map(([key, value]) => {
																						return `${key} : ${(
																							(value / log?.totalBytes) *
																							100
																						).toFixed(2)}%`;
																					})
																					.join(", ")
																			: "Not Available"}
																	</span>
																</p>
																<div className='mb-3'>
																	<strong>Contributors :</strong>
																	{log.contributors.length > 0 ? (
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
																				<ResponsiveContainer
																					width='100%'
																					height={400}>
																					<PieChart height={300}>
																						<Pie
																							data={log.contributors.map(
																								(contributor) => {
																									return {
																										...contributor,
																										fill: randomColor()
																									};
																								}
																							)}
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
																	<strong>Total Commits :</strong> {log.totalCommits}
																</p>
															</div>
														</div>
													</div>
												)
											}
										]}
										className='w-100'
									/>
								))}
							</div>
						</div>
					))}
				{logType === "bulkRepo" &&
					(logLoading ? (
						<Loading type='primary' />
					) : (
						<div className='card alternate-background primary-border mt-4 '>
							<div className='card-body primary-color d-flex flex-column gap-3'>
								<div className='card-body'>
									<p className='card-title'>Bulk Repository Log</p>
									<p className='card-subtitle mb-2 fw-light'>
										Log Instance Count : {logData?.length}
									</p>
								</div>
								{logData?.map((log) => (
									<Accordion
										data={[
											{
												title: (
													<div className='d-flex lh-1 w-100 pe-4 align-items-center flex-row justify-content-between'>
														<p className='pt-3'>{log.repo}</p>
														<p
															data-date={DateHandler.getTimeAgo(
																new Date(log.timeStamp).toISOString()
															)}
															className='pt-3 tooltip-custom'>
															{new Date(log.timeStamp).toLocaleString()}
														</p>{" "}
													</div>
												),
												content: (
													<div className='w-100'>
														<div className='list-group-item rounded-4 m-2' key={log._id}>
															<p>
																<strong className='mr-2'>Logged In User : </strong>
																{log.loggedInUser}
															</p>
															<p>
																<strong className='mr-2'>Repositories : </strong>
																{log.repo}
															</p>
															<h6
																data-date={DateHandler.getTimeAgo(
																	new Date(log.timeStamp).toISOString()
																)}
																className='tooltip-custom'>
																<strong className='mr-2'>Timestamp : </strong>
																{new Date(log.timeStamp).toLocaleString()}
															</h6>
															{log.response.map((repo) =>
																repo ? (
																	<li
																		className='list-group-item alternate-background border border-dark rounded-4 m-2'
																		key={repo.repoName}>
																		<div className='my-2 p-2 form-group'>
																			<div className='d-flex flex-row gap-3'>
																				<p>
																					<strong>Repository Name : </strong>{" "}
																					{repo.repoName}
																				</p>
																			</div>
																			<div className='d-flex flex-row gap-3'>
																				<p
																					data-date={DateHandler.getTimeAgo(
																						new Date(
																							repo.commitAt
																						).toISOString()
																					)}
																					className='tooltip-custom'>
																					<strong>Last Commit at : </strong>{" "}
																					{new Date(
																						repo.commitAt
																					).toLocaleString()}
																				</p>
																			</div>
																			<div className='d-flex flex-row gap-3'>
																				<p>
																					<strong>
																						Last Commit Author :{" "}
																					</strong>{" "}
																					{repo.commitAuthor}
																				</p>
																			</div>
																			<div className='d-flex flex-row gap-3'>
																				<p>
																					<strong>
																						Last Commit Message :{" "}
																					</strong>{" "}
																					{repo.commitMessage}
																				</p>
																			</div>
																			<div className='d-flex flex-row gap-3'>
																				<p>
																					<strong>Last Commit URL : </strong>{" "}
																					{repo.commitUrl}
																				</p>
																			</div>
																		</div>
																	</li>
																) : (
																	<li className='list-group-item border border-dark'>
																		<div className='d-flex flex-row w-100 align-items-center ps-3'>
																			<FontAwesomeIcon
																				icon={faWarning}
																				color='red'
																			/>
																			<p className='fw-bold text-danger pt-3 ps-2'>
																				Invalid Input
																			</p>
																		</div>
																	</li>
																)
															)}
														</div>
													</div>
												)
											}
										]}
										className='w-100'
									/>
								))}
							</div>
						</div>
					))}
				{logType === "commit" &&
					(logLoading ? (
						<Loading type='primary' />
					) : (
						<div className='card alternate-background primary-border mt-4 '>
							<div className='card-body primary-color d-flex flex-column gap-3'>
								<div className='card-body'>
									<p className='card-title'>Commit Log</p>
									<p className='card-subtitle mb-2 fw-light'>
										Log Instance Count : {logData?.length}
									</p>
								</div>
								{logData?.map((log) => (
									<Accordion
										data={[
											{
												title: (
													<div className='d-flex lh-1 w-100 pe-4 align-items-center flex-row justify-content-between'>
														<p className='pt-3'>{log.repo}</p>
														<p className='pt-3'>{log.sha}</p>
														<p
															data-date={DateHandler.getTimeAgo(
																new Date(log.timeStamp).toISOString()
															)}
															className='pt-3 tooltip-custom'>
															{new Date(log.timeStamp).toLocaleString()}
														</p>{" "}
													</div>
												),
												content: (
													<div className='w-100'>
														<div className='list-group-item rounded-4 m-2' key={log._id}>
															<p>
																<strong className='mr-2'>Logged In User : </strong>
																{log.loggedInUser}
															</p>
															<p>
																<strong className='mr-2'>Repository : </strong>
																{log.repo} /<strong className='mr-2'> SHA : </strong>
																{log.sha}
															</p>
															<h6
																data-date={DateHandler.getTimeAgo(
																	new Date(log.timeStamp).toISOString()
																)}
																className='tooltip-custom'>
																<strong className='mr-2'>Timestamp : </strong>
																{new Date(log.timeStamp).toLocaleString()}
															</h6>
															<div className='card p-3 my-4 alternate-background primary-color border border-dark'>
																<p>
																	<strong>SHA :</strong> {log.response.sha}
																</p>
																<p>
																	<strong>Repository :</strong> {log.response.repoUrl}
																</p>
																<p
																	data-date={DateHandler.getTimeAgo(
																		new Date(log.response.commitDate).toISOString()
																	)}
																	className='tooltip-custom'>
																	<strong>Date :</strong>{" "}
																	{new Date(log.response.commitDate).toLocaleString()}
																</p>
																<p>
																	<strong>Author :</strong>{" "}
																	{log.response.commitAuthor ? (
																		<>{log.response.commitAuthor}</>
																	) : (
																		<>Not Available</>
																	)}
																</p>
																<p>
																	<strong>Message :</strong>{" "}
																	{log.response.commitMessage}
																</p>
																<p>
																	<strong>Additions :</strong>{" "}
																	{log.response.additions}
																</p>
																<p>
																	<strong>Deletions :</strong>{" "}
																	{log.response.deletions}
																</p>
																<p>
																	<strong>Total Changes :</strong>{" "}
																	{log.response.totalChanges}
																</p>
																<p>
																	<strong>Files Change History</strong>
																</p>
																<table className='primary-border primary-color table table-bordered table-hover'>
																	<thead>
																		<tr>
																			<td>
																				<strong>File Name</strong>
																			</td>
																			<td>
																				<strong>Change Type</strong>
																			</td>
																			<td>
																				<strong>Additions</strong>
																			</td>
																			<td>
																				<strong>Deletions</strong>
																			</td>
																			<td>
																				<strong>Total Changes</strong>
																			</td>
																		</tr>
																	</thead>
																	<tbody>
																		{log.response.files.map((files) => {
																			return (
																				<tr>
																					<td>
																						<a>{files.name}</a>
																					</td>
																					<td>{files.changeType}</td>
																					<td>{files.additions}</td>
																					<td>{files.deletions}</td>
																					<td>{files.totalChanges}</td>
																				</tr>
																			);
																		})}
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												)
											}
										]}
										className='w-100'
									/>
								))}
							</div>
						</div>
					))}
				{logType === "repoCommit" &&
					(logLoading ? (
						<Loading type='primary' />
					) : (
						<div className='card alternate-background primary-border mt-4 '>
							<div className='card-body primary-color d-flex flex-column gap-3'>
								<div className='card-body'>
									<p className='card-title'>Commit List Log</p>
									<p className='card-subtitle mb-2 fw-light'>
										Log Instance Count : {logData?.length}
									</p>
								</div>
								{logData?.map((log) => (
									<Accordion
										data={[
											{
												title: (
													<div className='d-flex lh-1 w-100 pe-4 align-items-center flex-row justify-content-between'>
														<p className='pt-3'>{log.repo}</p>
														<p
															data-date={DateHandler.getTimeAgo(
																new Date(log.timeStamp).toISOString()
															)}
															className='pt-3 tooltip-custom'>
															{new Date(log.timeStamp).toLocaleString()}
														</p>{" "}
													</div>
												),
												content: (
													<div className='w-100'>
														<div className='list-group-item rounded-4 m-2' key={log._id}>
															<p>
																<strong className='mr-2'>Logged In User : </strong>
																{log.loggedInUser}
															</p>
															<p>
																<strong className='mr-2'>Repository : </strong>
																{log.repo} /
																<strong className='mr-2'>
																	{" "}
																	Max Entries Per Page :{" "}
																</strong>
																{log.perPage} /
																<strong className='mr-2'> Page No: </strong>
																{log.page} /
																<strong className='mr-2'> Commit Count : </strong>
																{log.response.length}
															</p>
															<h6
																data-date={DateHandler.getTimeAgo(
																	new Date(log.timeStamp).toISOString()
																)}
																className='tooltip-custom'>
																<strong className='mr-2'>Timestamp : </strong>
																{new Date(log.timeStamp).toLocaleString()}
															</h6>
															<div className='mb-3'>
																<strong>Commits Graph:</strong>
																<button
																	className='btn btn-sm btn-primary ms-2 '
																	style={{ height: "fit-content" }}
																	data-bs-toggle='collapse'
																	data-bs-target='#commits'
																	aria-controls='commits'>
																	Show/Hide
																</button>
																<div id='commits' className='collapse'>
																	<ResponsiveContainer width='100%' height={300}>
																		<LineChart data={log.graphData}>
																			<XAxis dataKey='date' />
																			<YAxis
																				label={{
																					value: "Commits",
																					angle: -90,
																					position: "insideMiddle",
																					fill: "#e5d4ed"
																				}}
																			/>
																			<Tooltip />
																			<Legend />
																			{log.authorList.map((author) => {
																				return (
																					<Line
																						type='monotone'
																						dataKey={`${author}`}
																						stroke={`${randomColor({
																							luminosity: "bright"
																						})}`}
																						animationDuration={3000}
																					/>
																				);
																			})}
																		</LineChart>
																	</ResponsiveContainer>
																</div>
															</div>
															{log.response.map((commits) => {
																return (
																	<div
																		className='card p-3 my-4 alternate-background primary-color border border-dark'
																		key={log.response._id}>
																		<p>
																			<strong>SHA :</strong> {commits.sha}
																		</p>
																		<p
																			data-date={DateHandler.getTimeAgo(
																				new Date(
																					commits.commitDate
																				).toISOString()
																			)}
																			className='tooltip-custom'>
																			<strong>Date :</strong>{" "}
																			{new Date(
																				commits.commitDate
																			).toLocaleString()}
																		</p>
																		<p>
																			<strong>Author :</strong>{" "}
																			{commits.commitAuthor ? (
																				<>{commits.commitAuthor}</>
																			) : (
																				<>Not Available</>
																			)}
																		</p>
																		<p>
																			<strong>Commit Message :</strong>{" "}
																			{commits.commitMessage}
																		</p>
																	</div>
																);
															})}
														</div>
													</div>
												)
											}
										]}
										className='w-100'
									/>
								))}
							</div>
						</div>
					))}
				{logType === "analyze" &&
					(logLoading ? (
						<Loading type='primary' />
					) : (
						<div className='card alternate-background primary-border mt-4 '>
							<div className='card-body primary-color d-flex flex-column gap-3'>
								<div className='card-body'>
									<p className='card-title'>Analyze Repository Log</p>
									<p className='card-subtitle mb-2 fw-light'>
										Log Instance Count : {logData?.length}
									</p>
								</div>
								{logData?.map((log) => (
									<Accordion
										data={[
											{
												title: (
													<div className='d-flex lh-1 w-100 pe-4 align-items-center flex-row justify-content-between'>
														<p className='pt-3'>{log.repo}</p>
														<p
															data-date={DateHandler.getTimeAgo(
																new Date(log.timeStamp).toISOString()
															)}
															className='pt-3 tooltip-custom'>
															{new Date(log.timeStamp).toLocaleString()}
														</p>{" "}
													</div>
												),
												content: (
													<div className='list-group-item rounded-4 m-2' key={log._id}>
														<p>
															<strong className='mr-2'>Logged In User : </strong>
															{log.loggedInUser}
														</p>
														<p>
															<strong className='mr-2'>Repository : </strong>
															{log.repo}
														</p>
														<p
															data-date={DateHandler.getTimeAgo(
																new Date(log.timeStamp).toISOString()
															)}
															className='tooltip-custom'>
															<strong className='mr-2'>Timestamp : </strong>
															{new Date(log.timeStamp).toLocaleString()}
														</p>
														<p>
															<strong className='mr-2'>Repository Grade : </strong>
															{log.repoGrade}
														</p>
														<p>
															<strong className='mr-2'>Message Filter List : </strong>
															{log.filterList}
														</p>

														<Accordion
															data={[
																{
																	title: "Statistics per Author",
																	content: (
																		<div className='p-4 w-100'>
																			{Object.entries(log.authorDetails).map(
																				([k, v]) => {
																					return (
																						<li
																							className='dark-background primary-border primary-color primary-shadow list-group-item border border-dark'
																							key={k}>
																							{v.commitDate ===
																							"Error" ? (
																								<></>
																							) : (
																								<>
																									<div className='my-1 p-1 form-group'>
																										<div className='d-flex flex-row gap-3'>
																											<p>
																												<strong>
																													Author
																													:{" "}
																												</strong>{" "}
																											</p>
																											{k !==
																											"undefined" ? (
																												<>{k}</>
																											) : (
																												<>
																													Not
																													Available
																												</>
																											)}
																										</div>
																										<div className='d-flex flex-row gap-3'>
																											<p>
																												<strong>
																													Latest
																													Commit
																													SHA
																													:{" "}
																												</strong>
																											</p>
																											{
																												v.commitSHA
																											}
																										</div>
																										<div className='d-flex flex-row gap-3'>
																											<p
																												data-date={DateHandler.getTimeAgo(
																													new Date(
																														v.commitDate
																													).toISOString()
																												)}
																												className='tooltip-custom'>
																												<strong>
																													Latest
																													Commit
																													Date
																													:{" "}
																												</strong>{" "}
																												{new Date(
																													v.commitDate
																												).toLocaleString()}
																											</p>
																										</div>
																										<div className='d-flex flex-row gap-3'>
																											<p>
																												<strong>
																													Total
																													Unique
																													Commit's
																													:{" "}
																												</strong>
																												{
																													v.commitCount
																												}
																											</p>
																										</div>
																										<div className='d-flex flex-row gap-3'>
																											<p>
																												<strong>
																													Average
																													Commit
																													Grade
																													:{" "}
																												</strong>{" "}
																												{
																													v.commitGrades
																												}
																											</p>
																										</div>
																									</div>
																								</>
																							)}
																						</li>
																					);
																				}
																			)}
																		</div>
																	)
																},
																{
																	title: "Statistics per Commit",
																	content: log.repoData.map((commit) => (
																		<li
																			className='dark-background primary-border primary-color primary-shadow list-group-item border border-dark'
																			key={commit.sha}>
																			<div className='my-1 p-1 form-group'>
																				<div className='d-flex flex-row gap-3'>
																					<p>
																						<strong>SHA :</strong>{" "}
																					</p>
																					{commit.sha}
																				</div>
																				{commit.commitDate === "Error" ? (
																					<strong>
																						Commit Data Not Available
																					</strong>
																				) : (
																					<>
																						<div className='d-flex flex-row gap-3'>
																							<p>
																								<strong>
																									Author :
																								</strong>{" "}
																							</p>
																							{commit.commitAuthor ? (
																								<>
																									{
																										commit.commitAuthor
																									}
																								</>
																							) : (
																								<>Not Available</>
																							)}
																						</div>
																						<div className='d-flex flex-row gap-3'>
																							<strong>Date : </strong>
																							<p
																								data-date={DateHandler.getTimeAgo(
																									new Date(
																										commit.commitDate
																									).toISOString()
																								)}
																								className='fw-light tooltip-custom'>
																								{new Date(
																									commit.commitDate
																								).toLocaleString()}
																							</p>
																						</div>
																						<div className='d-flex flex-row gap-3'>
																							<strong>Message : </strong>
																							<p className='fw-light'>
																								{commit.commitMessage}
																							</p>
																						</div>
																						<div
																							data-date={
																								commit.filteredMessage
																							}
																							className='d-flex flex-row gap-3 tooltip-custom'>
																							<strong>
																								Message Grade :{" "}
																							</strong>
																							<p className='fw-light'>
																								{commit.messageGrade}
																							</p>
																						</div>
																						<div className='d-flex flex-row gap-3'>
																							<p>
																								<strong>
																									Total Changes :{" "}
																								</strong>{" "}
																								{commit.totalChanges}
																							</p>
																						</div>
																						<div className='d-flex flex-row gap-3'>
																							<p>
																								<strong>
																									Changes Grade :{" "}
																								</strong>{" "}
																								{commit.changeGrade}
																							</p>
																						</div>
																						<div className='d-flex flex-row gap-3'>
																							<p>
																								<strong>
																									Commit Grade :{" "}
																								</strong>{" "}
																								{commit.commitGrade}
																							</p>
																						</div>
																					</>
																				)}
																			</div>
																		</li>
																	))
																}
															]}
															className='w-100'
														/>
													</div>
												)
											}
										]}
										className='w-100'
									/>
								))}
							</div>
						</div>
					))}
				{logType === "loggedUsers" &&
					(logLoading ? (
						<Loading type='primary' />
					) : (
						<div className='card alternate-background primary-border mt-4 '>
							<div className='card-body primary-color d-flex flex-column gap-3'>
								<div className='card-body'>
									<p className='card-title'>Logged Users Log</p>
									<p className='card-subtitle mb-2 fw-light'>
										Log Instance Count : {logData?.length}
									</p>
								</div>
								{logData?.map((log) => (
									<Accordion
										data={[
											{
												title: (
													<div className='d-flex lh-1 w-100 pe-4 align-items-center flex-row justify-content-between'>
														<p className='pt-3'>{log.username}</p>
														<p className='pt-3'>{FlagHandler.getUserIcon(log.status)}</p>
														<p
															data-date={DateHandler.getTimeAgo(
																new Date(log.timeStamp).toISOString()
															)}
															className='pt-3 tooltip-custom'>
															{new Date(log.timeStamp).toLocaleString()}
														</p>{" "}
													</div>
												),
												content: (
													<div className='w-100'>
														<div className='list-group-item rounded-4 m-2' key={log._id}>
															<p>
																<strong className='mr-2'>Username : </strong>
																{log.username}
															</p>
															<p>
																<strong className='mr-2'>User ID : </strong>
																{log.id}
															</p>
															<p>
																<strong className='mr-2'>Email: </strong>
																{log.email ? log.email : "Not Available"}
															</p>
															<p>
																<strong className='mr-2'>Status : </strong>
																{log.status}
															</p>
															<p
																data-date={DateHandler.getTimeAgo(
																	new Date(log.timeStamp).toISOString()
																)}
																className='tooltip-custom'>
																<strong className='mr-2'>TimeStamp: </strong>
																{new Date(log.timeStamp).toLocaleString()}
															</p>
														</div>
													</div>
												)
											}
										]}
										className='w-100'
									/>
								))}
							</div>
						</div>
					))}
			</div>
		</div>
	);
}

export default AdminLog;
