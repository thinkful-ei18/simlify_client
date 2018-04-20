import React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { fetchQuestion, submitAnswer, fetchReport, generateQuestions } from "../actions/trainning"
import Input from "./training-input"
import { Field, reduxForm, focus, reset } from "redux-form"
import Dialog from "material-ui/Dialog"
import Report from "./report"
import GoRocket from "react-icons/lib/go/rocket"
import GoX from "react-icons/lib/go/x"
import "../css/trainning.css"
const customContent = {
	width: "450px",
	height: "500px",
	backgroundColor: "grey"
}
const bodyStyle = {
	backgroundColor: "grey"
}
export class Trainning extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false
		}
	}
	handleOpen() {
		this.setState({
			open: true
		})
	}
	handleClose() {
		this.setState({
			open: false
		})
	}
	componentDidMount() {
		const { dispatch } = this.props
		dispatch(fetchQuestion())
	}
	onSubmit(values) {
		this.props.dispatch(reset("question"))
		this.props.dispatch(submitAnswer(values))
	}
	fetchNextQuestion(e) {
		e.preventDefault()
		this.props.dispatch(fetchQuestion())
	}
	handleFetchReport(e) {
		e.preventDefault()
		this.handleOpen()
		this.props.dispatch(fetchReport())
	}
	handleNewQuestionSet(e) {
		e.preventDefault()
		this.props.dispatch(generateQuestions()).then(() => {
			this.props.dispatch(fetchQuestion())
		})
		this.handleClose()
	}

	render() {
		const { currentQuestion, feedback, authToken } = this.props

		if (!authToken) {
			return <Redirect to="/" />
		}
		if (!currentQuestion) return <div />
		let renderFeedback
		if (feedback) {
			if (feedback.status === "good") {
				renderFeedback = (
					<p>
						<GoRocket color={"green"} /> Horray !
					</p>
				)
			} else {
				renderFeedback = (
					<p className="training-feedback">
						<GoX color={"red"} size={24} /> You got it wrong! It's
						<span> " {feedback.correctAnswer} " </span>
					</p>
				)
			}
		}
		let renderBtn
		if (!this.props.next) {
			renderBtn = (
				<button disabled={this.props.next} type="submit">
					Submit
				</button>
			)
		} else {
			renderBtn = (
				<button
					disabled={!this.props.next}
					onClick={e => this.fetchNextQuestion(e)}
					className="training-next"
				>
					Next Question
				</button>
			)
		}

		return (
			<div className="training-container">
				<Dialog
					modal={true}
					open={this.state.open}
					autoScrollBodyContent={true}
					contentStyle={customContent}
				>
					<Report />
					<div className="report-btn">
						<button onClick={e => this.handleNewQuestionSet(e)}>Start new session</button>
					</div>
				</Dialog>
				<div className="training-content animated fadeIn">
					<header className="training-header">
						<p>
							What does <strong>"{currentQuestion.question}"</strong> mean?
						</p>
					</header>
					<section className="training-body">
						{renderFeedback}
						<form
							onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
							className="training-input-group"
						>
							<Field
								type="text"
								name="answer"
								component={Input}
								autocomplete="off"
								disabled={this.props.next ? true : false}
							/>
							{renderBtn}
						</form>
						<div className="training-control-group">
							<button onClick={e => this.handleFetchReport(e)}>End session</button>
						</div>
					</section>
				</div>
			</div>
		)
	}
}
const mapStateToProps = state => {
	return {
		currentQuestion: state.trainning.currentQuestion,
		feedback: state.trainning.feedback,
		authToken: state.user.authToken,
		next: state.trainning.next
	}
}
export default reduxForm({
	form: "question",
	onSubmitFail: (errors, dispatch) => dispatch(focus("question", Object.keys(errors)[0]))
})(connect(mapStateToProps)(Trainning))
