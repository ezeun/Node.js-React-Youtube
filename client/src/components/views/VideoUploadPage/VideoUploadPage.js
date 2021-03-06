import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    {value: 0, label: "Private" },
    {value: 1, label: "Public" }
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation" },
    {value: 1, label: "Autos & Vehicles" },
    {value: 2, label: "Music" },
    {value: 3, label: "Pets & Animals" },
]

function VideoUploadPage(props){
    const user = useSelector(state => state.user); //user의 모든 정보가 user변수에 담김
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)    
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => { //files : 파일의 정보 담겨있음

        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])

        Axios.post('/api/video/uploads', formData, config) // 서버에 request 보내기
            .then(response => {
                if(response.data.success){
                    console.log(response.data)

                    let variable = {
                        url:response.data.url,
                        fileName: response.data.fileName
                    };

                    setFilePath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable)
                    .then(response => {
                        if(response.data.success){
                            
                            setDuration(response.data.fileDuration)
                            setThumbnailPath(response.data.url)

                        } else{
                            alert('썸네일 생성에 실패 했습니다.')
                        }                    
                    })

                }else{
                    alert('비디오 업로드를 실패했습니다.')
                }
            })
    }

    const onSubmit = (e) => {
        e.preventDefault(); //클릭하면, 원래 하려고 했던 것들을 방지하고 하고싶은 것들(아래 코드)을 하게함
        
        const variables = {
            writer: user.userData._id, //redux를 통해 user정보를 가져옴
            title: VideoTitle, //state에서 정보를 가지고 있음
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }
        
        Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if(response.data.success){
                    message.success('성공적으로 업로드를 했습니다.')
                    
                    setTimeout(() => {
                        props.history.push('/')
                    },3000);
                    
                } else{
                    alert('비디오 업로드에 실패 했습니다.')
                }                    
            })
    }



    return(
        <div style={{ maxWidth: '700px', margin:'2rem auto'}}>
            <div style={{ testAlign:'center', marginBottom: '2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display:'flex', justifyContent: 'space-between'}}>
                    
                    {/* Drop zone */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false} //파일을 한번에 하나씩만 올리기
                        maxSize={1000000000}
                    >
                    {({ getRootProps, getInputProps}) => (
                        <div style={{width: '300px', height: '240px', border:'1px solid lightgray',
                        alignItems: 'center', justifyContent: 'center', display: 'flex'}} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize:'3rem'}} />
                        </div>
                    )}
                    </Dropzone>

                    {/* Thumbnail */}
                    
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }

                </div>
                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage