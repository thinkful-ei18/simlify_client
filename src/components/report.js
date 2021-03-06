import React from "react"
import { connect } from "react-redux"
import "../css/report.css"
export function Report(props) {
	if (props.loading || !props.reports) {
		return <div>Page is loading ...</div>
	}
	if (props.error) {
		return <div>Something is not right</div>
	}
	const renderReport = props.reports.map((report, index) => {
		if (report.totalAttempt !== 0) {
			return (
				<li key={index} className="report-item">
					<div>
						<span className="report-question">
							<strong>{report.question}</strong>
						</span>
						<span>
							<strong>{report.answer}</strong>
						</span>
					</div>
				</li>
			)
		}
		return ""
	})
	return <ul style={{ padding: "0", backgroundColor: "white" }}>{renderReport}</ul>
}

const mapStateToProps = state => ({
	reports: state.trainning.report,
	loading: state.trainning.loading,
	error: state.trainning.error
})

export default connect(mapStateToProps)(Report)
