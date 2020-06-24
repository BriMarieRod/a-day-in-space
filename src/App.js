import React from 'react';
import './App.css';

class APODImage extends React.Component {

	render() {
		console.log(this.props);
		console.log("APODImage render");
		const data = this.props.data;
		const originalWidth = this.props.width;
		let width = this.props.isFullSize ? originalWidth : '672px';
		// console.log(this.props.isFullSize);
		//
		/*
		if(this.state.isLoaded) {
			if(this.props.isFullSize) {
				return <img className="APOD-img" src={data.url} alt={data.title} width={this.state.width} />;
			} else {
				return <img className="APOD-img" src={data.url} alt={data.title} width="50%" />;
			}
		} else {
			return <img className="APOD-img" src={data.url} alt={data.title} width="50%" />;
		}*/
		return <a href={data.hdurl} className="APOD-img-link" style={{width: width,}}><img className="APOD-img" src={data.url} alt={data.title} width={width} /></a>;
	}

}

class APODContent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			imageIsLoaded: false,
			imageWidth: '672px',
			imageHeight: null,
		};
	}

	componentDidMount() {
		if(this.props.data !== null) {
			let img = new Image();
			img.src = this.props.data.url;
			let comp = this;
			img.onload = function() {
				console.log('width=' + this.width);
				comp.setState({
					imageIsLoaded: true,
					imageWidth: this.width,
					imageHeight: this.height,
				});
				console.log(comp.state);
			};
		} else {
			setTimeout( () => this.componentDidMount() , 300);
		}
	}

	render() {
		console.log("APODContent render");
		//console.log(this.props);
		if(this.props.data) {
			const data = this.props.data;
			//console.log(data);
			// console.log(this.props.isImageFullSize);
			return <div className="APOD-content">
				<APODImage data={data} isFullSize={this.props.isImageFullSize} width={this.state.imageWidth} height={this.state.imageHeight} />
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
			console.log(json);
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
		console.log("APOD render");
		return <article className="APOD">
			<div className="container">
				<header className="APOD-header">
					<h2>Astronomy Picture of the Day</h2>
					<button onClick={ () => this.handleImageSizeToggler() }>Toggle Full Size Image</button>
				</header>
				<APODContent isImageFullSize={this.state.isImageFullSize} data={this.state.data} value={this.state.isImageFullSize} />
			</div>
		</article>;
	}
}

class AppContent extends React.Component {
	render() {
		return <main>
			<APOD />
		</main>;
	}
}

class App extends React.Component {

	render() {
		return <div className="App">
			<header className="App-header">
				<h1>A Day In Space</h1>
			</header>
			<AppContent />
		</div>;
	}

}

export default App;
