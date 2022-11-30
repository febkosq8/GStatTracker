import React, { useContext, useState, useEffect, useQuery } from "react";
import APIHandler from "../handlers/APIHandler";
import Event from "../providers/EventProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Configuration from "../providers/ConfigProvider";

function DeleteButton({ ...props }) {
	const DefaultConfig = useContext(Configuration);
	const EventHandler = useContext(Event);

	const [clickCount, setClickCount] = useState(0);
	const triggerToast = () => {
		EventHandler.publish("toast", {
			message: props.text + " was purged! Reload app if needed.",
			type: "success"
		});
	};
	const handleLogDeletion = (logType) => {
		APIHandler.deleteLog(logType).then(() => {
			EventHandler.publish("toast", {
				message: props.text + " was purged!",
				type: "success"
			});
		});
	};
	const handleLocalDeletion = (logType) => {
		triggerToast();
		if (logType === "config") {
			DefaultConfig.deleteConfig("activeTime");
			DefaultConfig.deleteConfig("perPage");
			DefaultConfig.deleteConfig("logTime");
			return;
		}
		if (logType === "list") {
			DefaultConfig.deleteConfig("messageFilterList");
			DefaultConfig.deleteConfig("repoList");
			return;
		}
		if (logType === "token") {
			DefaultConfig.deleteConfig("token");
			return;
		}
	};
	const handleSingleClick = () => {
		if (clickCount === 0) {
			EventHandler.publish("toast", {
				message: "IRREVERSIBLE ACTION : Double click to confirm",
				type: "info"
			});
			setClickCount(clickCount + 1);
		} else if (clickCount === 1) {
			setClickCount(0);
			if (props.scope === "log") {
				handleLogDeletion(props.type);
				return;
			}
			handleLocalDeletion(props.type);
		}
	};
	useEffect(() => {
		let timeOut = setTimeout(() => {
			if (clickCount === 1) {
				setClickCount(0);
			}
		}, 2000);
		return () => {
			clearTimeout(timeOut);
		};
	}, [clickCount]);
	return (
		<div className={`input-group m-2 ${props.className}`} style={{ height: "3rem" }}>
			<h6 className='input-group-text dark-background primary-border primary-color text-decoration-none disabled h-100 w-75'>
				{props.text}
			</h6>
			<button
				type='submit'
				className='btn btn-primary h-100'
				onClick={() => {
					handleSingleClick();
				}}>
				<FontAwesomeIcon icon={faTrash} />
			</button>
		</div>
	);
}

export default DeleteButton;
