const React = require('react')

class LogIn extends React.Component {
	render() {
		var recovery
		if(this.props.email){
			recovery = (<div className="text-center">
				<a className="login-link" href="/recuperar-password">Recuperar password</a>
			</div>)
		}else{
			recovery = (<div className="text-center">
				Para recuperar tu password contacta a los organizadores
			</div>)
		}

		return (
			<div className="panel-widget panel panel-default">
				<div className="widget-head">
					<h3 className="title">Log in</h3>
				</div>
				<div className="widget-body">
					<form action="/login" method="POST">
						<div className="login-form">

							<div className="form-group">
								<p className="label-over-input">
									<label>Email</label>
								</p>
								<input type="email" name="email" className="form-control login-field" placeholder="Email" id="login-name" required="true"/>
							</div>

							<div className="form-group">
								<p className="label-over-input">
									<label>Password</label>
								</p>
								<input type="password" name="password" className="form-control login-field" placeholder="Password" id="login-pass" required="true"/>
							</div>

							<input type="hidden" name="_csrf" value={this.props.csrf}/>

							<button className="btn btn-lg btn-block btn-primary" type="submit">Log in</button>
							{recovery}
						</div>
					</form>
				</div>
			</div>
		)
	}
}

module.exports = LogIn
