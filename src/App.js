
import './App.css';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import { Component } from 'react';
import Clarifai from 'clarifai'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const app = new Clarifai.App({
  apiKey: "9de7c18ec75c47e7a89bb925d7562f43",
 });

const particlesOption = {  
    particles: {
        number: {
          value: 150,
          density: {
            enable: true,
            value_area: 800
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#000000",
          opacity: 0.4,
          width: 1
        }
       
          
        
    }
}



class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin', // This is used for tracking where we are on the page.
      isSignedIn : false,
    }
  }

  calcFaceLocation = (data)=>{
    const clarifiFace = data.outputs[0].data.regions[0].region_info.bounding_box ;
    const image  = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    const box = {
      leftCol: clarifiFace.left_col * width ,
      topRow: clarifiFace.top_row * height,
      rightCol: width - (clarifiFace.right_col * width),
      bottomRow: height - (clarifiFace.bottom_row * height)
    }
    this.setState({box: box})
    console.log(this.state.box);
  }

  // displayFaceBox = (box) => {
  //   this.setState({box: box})
  //   console.log(this.state.box);
  // }
  
  onInputChange= (event)=>{
    console.log(event.target.value);
    this.setState({input: event.target.value})
  }

  onButtonSubmit= ()=>{
    this.setState({imageUrl: this.state.input})
    console.log('click');
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL,// THE JPG
    this.state.input)
    .then((response) => {
      this.calcFaceLocation(response);     
     })
     .catch((err) => {
      console.log(err);
     });      

  }

  onRouteChange = (route)=>{
    if(route === 'signout')
    {
      this.setState({isSignedIn: false})
    }
    else if(route=== 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render(){
    const {isSignedIn, imageUrl , route, box } = this.state;
    return(
      
    <div className="App">
      <Particles className='particles'
       params={particlesOption}/>
      <Navigation isSignedIn={isSignedIn}  onRouteChange={this.onRouteChange} />
      {/* For making JSX to JavaScript we have to add the curly braces */}
      { route === 'home' 
          ?  
        <div>
        <Logo/>      
       <Rank/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>      
      <FaceRecognition box={box} imageUrl={imageUrl}/>
      </div>
      
      :(
        route === 'signin' ? <Signin onRouteChange={this.onRouteChange}/> :
        <Register onRouteChange={this.onRouteChange}/>
      ) 
    }
    </div>
    

    )
  }
}

export default App;
