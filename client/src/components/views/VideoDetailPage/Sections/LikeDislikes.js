import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variable = {}

    if(props.video){
        variable = { videoId: props.videoId, userId: props.userId } //from VideoDetailPage
    }else{
        variable = { commentId: props.commentId, userId: props.userId } //from SingleComment.js
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                if(response.data.success){
                    //얼마나 많은 좋아요를 받았는지
                    setLikes(response.data.likes.length)

                    //내가 이미 그 좋아요를 눌렀는지
                    response.data.likes.map(like => { //response.data.likes : 이 비디오나 댓글에 대해 좋아요를 누른 모든 사람 정보
                        if(like.userId === props.userId){ //props.userId : 내 아이디
                            setLikeAction('liked')
                        }
                    })
                }else{
                    alert('Likes에 대한 정보를 가져오지 못했습니다.')
                }
            })

        Axios.post('/api/like/getDislikes', variable)
        .then(response => {
            if(response.data.success){
                //얼마나 많은 싫어요를 받았는지
                setDislikes(response.data.dislikes.length)

                //내가 이미 그 싫어요를 눌렀는지
                response.data.dislikes.map(dislike => {
                    if(dislike.userId === props.userId){
                        setDislikeAction('disliked')
                    }
                })
            }else{
                alert('Dislikes에 대한 정보를 가져오지 못했습니다.')
            }
        })
    }, [])


    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'} //내가 누른거면 filled
                        onClick
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>
        </div>
    )
}

export default LikeDislikes
