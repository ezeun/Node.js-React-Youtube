import React, { useState } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import { Comment, Avatar, Button, Input } from 'antd';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {  
    const user = useSelector(state => state.user); //redux의 state에서 user 정보를 가져옴

    const [OpenReply, setOpenReply] = useState(false) //초기상태 : comment form 안보임
    const [CommentValue, setCommentValue] = useState("")

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault(); //페이지 리프레시 방지
  
        const variables = {
            content: CommentValue,
            writer: user.userData._id, //localstorage에서 가져와도되는데 redux로 해봤음
            postId: props.postId,
            responseTo: props.comment._id
        }
  
        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
          if(response.data.success){
              console.log(response.data.result)
              setCommentValue("")
              setOpenReply(false) //대댓글 작성&submit하면 대댓글 작성 칸 숨기기
              props.refreshFunction(response.data.result) //댓글 업데이트
          }else{
              alert('커멘트를 저장하지 못했습니다.')
          }
        })
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />
        ,<span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions} //reply to 버튼을 누르면 comment form이 등장/사라짐 되도록
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={ <p> {props.comment.content} </p>}
            />

            {OpenReply && //OpenReply가 true일때만 comment form이 보이도록 함
                <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={ onHandleChange }
                    value={ CommentValue }
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
                </form>
            }
        </div>
    )
}

export default SingleComment
