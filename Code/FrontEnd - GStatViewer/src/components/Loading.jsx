const Loading = ({ type = "secondary", size }) => (
	<div className='d-flex flex-column w-100 h-auto my-auto mx-auto justify-content-center align-items-center'>
		<div className={`spinner-border ${size ? "spinner-border-" + size : ""} text-${type}`} role='status'></div>
	</div>
);
export default Loading;
