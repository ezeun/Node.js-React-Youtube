import React, { useState } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment';

function Comment(props) {

  const videoId = props.postId;
  
  const user = useSelector(state => state.user); //redux의 state에서 user 정보를 가져옴
  const [commentValue, setcommentValue] = useState("")

  const handleClick = (event) => { //타이핑 가능하게 해줌
      setcommentValue(event.currentTarget.value)
  }

  const onSubmit = (event) => {
      event.preventDefault(); //페이지 리프레시 방지

      const variables = {
          content: commentValue,
          writer: user.userData._id, //localstorage에서 가져와도되는데 redux로 해봤음
          postId: videoId
      }

      Axios.post('/api/comment/saveComment', variables)
      .then(response => {
        if(response.data.success){
            console.log(response.data.result)
            setcommentValue("")
            props.refreshFunction(response.data.result) //댓글 업데이트
        }else{
            alert('커멘트를 저장하지 못했습니다.')
        }
      })
  }

  return (
    <div>
        <br />
        <p> Replies</p>
        <hr />

        {/* Coment Lists */}

        {props.commentLists && props.commentLists.map((comment, index) => (
            (!comment.responseTo &&//첫번째 depth만 출력
                <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} />
            )
        ))}
        

        {/* Root Comment Form */}

        <form style={{ display: 'flex' }} onSubmit={onSubmit} >
          <textarea
              style={{ width: '100%', borderRadius: '5px' }}
              onChange={ handleClick }
              value={commentValue}
              placeholder="코멘트를 작성해 주세요"
          />
          <br />
          <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
        </form>
    </div>
  )
}

export default Comment
