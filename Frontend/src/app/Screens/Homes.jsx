"use client";
import React, { useState, useRef } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import Webcam from 'react-webcam';

import { GrRotateLeft, GrRotateRight } from 'react-icons/gr'
import { CgMergeVertical, CgMergeHorizontal } from 'react-icons/cg'
import { IoMdUndo, IoMdRedo, IoIosImage } from 'react-icons/io'
import storeData from './LinkedList'
import Navbar from '../components/Navbar';

const videoConstraints = {
    width: 540,
    facingMode: 'environment'
};

const Home = () => {
    const filterElement = [

        {
            name: 'brightness',
            maxValue: 200
        },
        {
            name: 'grayscale',
            maxValue: 200
        },
        {
            name: 'sepia',
            maxValue: 200
        },
        {
            name: 'saturate',
            maxValue: 200
        },
        {
            name: 'contrast',
            maxValue: 200
        },
        {
            name: 'hueRotate'
        }
    ]
    const [property, setProperty] = useState(
        {
            name: 'brightness',
            maxValue: 200
        }
    )

    const webcamRef = useRef(null);
    const [url, setUrl] = useState(null);




    const onUserMedia = (e) => {
        console.log(e);
    };
    const [details, setDetails] = useState('')
    const [crop, setCrop] = useState('')
    const [state, setState] = useState({
        image: '',
        brightness: 100,
        grayscale: 0,
        sepia: 0,
        saturate: 100,
        contrast: 100,
        hueRotate: 0,
        rotate: 0,
        vartical: 1,
        horizental: 1
    })
    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })


    }

    const [showWebcam, setShowWebcam] = useState(true);

    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();

        // Create a canvas element to convert the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Create an image element and set its source to the PNG image data
        const img = new Image();
        img.src = imageSrc;

        // When the image is loaded, draw it onto the canvas
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Convert the canvas to a data URL with JPG format
            const jpgImageDataUrl = canvas.toDataURL('image/jpeg');

            // Update the state with the JPG image URL
            setUrl(jpgImageDataUrl);
            setShowWebcam(false);
            // Update the state with the image data
            setState({
                ...state,
                image: jpgImageDataUrl
            });

            console.log(jpgImageDataUrl);
        };


    };
    const leftRotate = () => {
        setState({
            ...state,
            rotate: state.rotate - 90
        })

        const stateData = state
        stateData.rotate = state.rotate - 90
        storeData.insert(stateData)
    }

    const rightRotate = () => {
        setState({
            ...state,
            rotate: state.rotate + 90
        })
        const stateData = state
        stateData.rotate = state.rotate + 90
        storeData.insert(stateData)
    }
    const varticalFlip = () => {
        setState({
            ...state,
            vartical: state.vartical === 1 ? -1 : 1
        })
        const stateData = state
        stateData.vartical = state.vartical === 1 ? -1 : 1
        storeData.insert(stateData)
    }

    const horizentalFlip = () => {
        setState({
            ...state,
            horizental: state.horizental === 1 ? -1 : 1
        })
        const stateData = state
        stateData.horizental = state.horizental === 1 ? -1 : 1
        storeData.insert(stateData)
    }

    const redo = () => {
        const data = storeData.redoEdit()
        if (data) {
            setState(data)
        }
    }
    const undo = () => {
        const data = storeData.undoEdit()
        if (data) {
            setState(data)
        }
    }
    const imageHandle = (e) => {
        if (e.target.files.length !== 0) {

            const reader = new FileReader()

            reader.onload = () => {
                console.log(reader.result)
                setState({
                    ...state,
                    image: reader.result
                })

                const stateData = {
                    image: reader.result,
                    brightness: 100,
                    grayscale: 0,
                    sepia: 0,
                    saturate: 100,
                    contrast: 100,
                    hueRotate: 0,
                    rotate: 0,
                    vartical: 1,
                    horizental: 1
                }
                storeData.insert(stateData)
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }
    const imageCrop = () => {
        const canvas = document.createElement('canvas')
        const scaleX = details.naturalWidth / details.width
        const scaleY = details.naturalHeight / details.height
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')

        ctx.drawImage(
            details,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        )

        const base64Url = canvas.toDataURL('image/jpg')

        setState({
            ...state,
            image: base64Url
        })
    }
    const saveImage = () => {
        const canvas = document.createElement('canvas')
        canvas.width = details.naturalHeight
        canvas.height = details.naturalHeight
        const ctx = canvas.getContext('2d')

        ctx.filter = `brightness(${state.brightness}%) brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`

        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(state.rotate * Math.PI / 180)
        ctx.scale(state.vartical, state.horizental)

        ctx.drawImage(
            details,
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
        )

        // const link = document.createElement('a')
        // link.download = 'image_edit.jpg'
        // link.href=canvas.toDataURL()
        // link.click()

        fetch('canvas.toDataURL()')
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
                console.log(blob);
                // Here's where you get access to the blob
                // And you can use it for whatever you want
                // Like calling ref().put(blob)

                // Here, I use it to make an image appear on the page
                let objectURL = URL.createObjectURL(blob);
                let myImage = new Image();
                myImage.src = objectURL;
                document.getElementById('myImg').appendChild(myImage)
            });
    }
    return (
        <>
            <Navbar />
            <div className='image_editor'>
                <div className="card">
                    <div className="card_header">
                        <h2>------ Image Editor ------</h2>
                    </div>
                    <div className="card_body">
                        <div className="sidebar">
                            <div className="side_body">
                                <div className="filter_section">
                                    <span>Filters</span>
                                    <div className="filter_key">
                                        {
                                            filterElement.map((v, i) => <button className={property.name === v.name ? 'active' : ''} onClick={() => setProperty(v)} key={i} >{v.name}</button>)
                                        }
                                    </div>
                                </div>
                                <div className="filter_slider">
                                    <div className="label_bar">
                                        <label htmlFor="range">Rotate</label>
                                        <span>100%</span>
                                    </div>
                                    <input name={property.name} onChange={inputHandle} value={state[property.name]} max={property.maxValue} type="range" />
                                </div>
                                <div className="rotate">
                                    <label htmlFor="">Rotate & Filp</label>
                                    <div className="icon">
                                        <div onClick={leftRotate}><GrRotateLeft /></div>
                                        <div onClick={rightRotate}><GrRotateRight /></div>
                                        <div onClick={varticalFlip}><CgMergeVertical /></div>
                                        <div onClick={horizentalFlip}><CgMergeHorizontal /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="reset">
                                <button>Reset</button>
                                <button onClick={saveImage} className='save'>Save Image</button>
                                <div id="myImg"></div>
                            </div>
                        </div>
                        <div className="image_section">
                            {showWebcam ? (
                                <Webcam
                                    ref={webcamRef}
                                    screenshotFormat="image/png"
                                    videoConstraints={videoConstraints}
                                    onUserMedia={onUserMedia}
                                    mirrored={true}
                                />
                            ) : (
                                <div className="image">
                                    {



                                        state.image ? <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                                            <img onLoad={(e) => setDetails(e.currentTarget)} style={{ filter: `brightness(${state.brightness}%) brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`, transform: `rotate(${state.rotate}deg) scale(${state.vartical},${state.horizental})` }} src={state.image} alt="" />
                                        </ReactCrop> :
                                            <label htmlFor="choose">
                                                <IoIosImage />
                                                <span>Choose Image</span>
                                            </label>
                                    }
                                </div>
                            )}

                            <>



                                <button onClick={capturePhoto}>Capture</button>



                                <button onClick={() => {
                                    setUrl(null);
                                    setShowWebcam(true);
                                }}>Refresh</button>

                                {/* {url && (
                                    <div>
                                        <img src={url} alt="Screenshot" />
                                    </div>
                                )} */}
                            </>
                            <div className="image_select">
                                <button onClick={undo} className='undo'><IoMdUndo /></button>
                                <button onClick={redo} className='redo'><IoMdRedo /></button>
                                {
                                    crop && <button onClick={imageCrop} className='crop'>Crop Image</button>
                                }

                                <input onChange={imageHandle} type="file" id='choose' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home