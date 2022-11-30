import Accordion from "react-bootstrap/Accordion";
const Panel = (props) => {
	let { data, ...rest } = props;
	return (
		<Accordion defaultActiveKey='0' {...rest}>
			{data
				.filter((item) => item.visible ?? true)
				.map((item, index) => (
					<Accordion.Item eventKey={index}>
						<Accordion.Header>{item.title}</Accordion.Header>
						<Accordion.Body>{item.content}</Accordion.Body>
					</Accordion.Item>
				))}
		</Accordion>
	);
};
export default Panel;
