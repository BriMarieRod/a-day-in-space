import React from 'react';
import './App.css';

class APODImage extends React.Component {

	render() {
		console.log(this.props);
		const data = this.props.data;
		let drawWidth = this.props.windowSize.width >= 1000 ? this.props.size.width*.35 : this.props.windowSize.width * .9;
		let width = this.props.isFullSize ? this.props.size.width : drawWidth;
		return <a href={data.hdurl} className="APOD-img-link" style={{width: width+'px',}}><img className="APOD-img" src={data.url} alt={data.title} width={width+'px'} /></a>;
	}

}

class APODContent extends React.Component {

	constructor(props) {
		super(props);
		let halfSize = .70 * .5 * this.props.windowSize.width;
		this.state = {
			imageIsLoaded: false,
			smallImageSize: halfSize,
			imageSize: {
				width: null,
				height: null,
			},
			drawSize: {
				width: halfSize,
				height: null,
			},
		};
	}

	componentDidMount() {
		if(this.props.data !== null) {
			let img = new Image();
			img.src = this.props.data.url;
			let comp = this;
			img.onload = function() {
				comp.setState({
					imageIsLoaded: true,
					imageSize: {
						width: this.width,
						height: this.height,
					},
				});
			};
		} else {
			setTimeout( () => this.componentDidMount() , 300);
		}
		//window.addEventListener("resize", () => this.updateDimensions() );
	}

	componentWillUnmount() {
		window.removeEventListener("resize", () => this.updateDimensions() );
	}

	updateDimensions() {
		this.setState({
			imageSize: {
				width: this.props.windowSize.width,
				height: this.props.windowSize.height,
			},
		});
	}

	computeDrawSize() {
		if(this.props.windowSize.width < 1000) {
			this.setState({
				drawSize: {
					width: this.props.windowSize.width * .9,
				},
			});
		} else {
			this.setState({
				drawSize: {
					width: this.props.windowSize.width * .35,
				},
			});
		}
	}

	render() {
		//console.log(this.props.windowSize.width);
		//console.log(this.state.imageSize);
		let data = this.props.data;
		if(data) {
			return <div className="APOD-content">
				<APODImage data={data} isFullSize={this.props.isImageFullSize} size={this.state.imageSize} drawSize={this.state.drawSize} windowSize={this.props.windowSize} />
				<div className="APOD-explanation">
					<header>
						<h3>{data.title}</h3>
					</header>
					<p>{data.explanation}</p>
				</div>
			</div>;
		} else {
			return <p>Loading</p>;
		}
	}

}

class APOD extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isFetched: false,
			data: null,
			isImageFullSize: false,
		};
	}

	componentDidMount() {
		const url = 'https://api.nasa.gov/planetary/apod?date=2020-06-24&api_key=qbcsnvv4BEnmaiuI9RBgq5PGuDTs9Ih6eoaKsNu5';
		fetch(url).then( res => res.json() ).then( json => {
			//console.log(json);
			this.setState({
				isFetched: true,
				data: json,
			});
		} );
	}

	handleImageSizeToggler() {
		this.setState({
			isImageFullSize: !this.state.isImageFullSize,
		});
	}

	render() {
		return <article className="APOD">
			<div className="container">
				<header className="APOD-header">
					<h2>Astronomy Picture of the Day</h2>
					<button onClick={ () => this.handleImageSizeToggler() }>Toggle Full Size Image</button>
				</header>
				<APODContent isImageFullSize={this.state.isImageFullSize} data={this.state.data} windowSize={this.props.windowSize} />
			</div>
		</article>;
	}
}

class AppContent extends React.Component {
	render() {
		return <main>
			<APOD windowSize={this.props.windowSize} />
		</main>;
	}
}

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			windowSize: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
		};
	}

	componentDidMount() {
		window.addEventListener("resize", () => this.updateDimensions() );
	}

	componentWillUnmount() {
		window.removeEventListener("resize", () => this.updateDimensions() );
	}

	updateDimensions() {
		console.log("Updating");
		this.setState({
			windowSize: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
		});
	}

	render() {
		//console.log(this.state);
		return <div className="App">
			<header className="App-header">
				<h1>A Day In Space</h1>
			</header>
			<AppContent windowSize={this.state.windowSize} />
		</div>;
	}

}

export default App;
