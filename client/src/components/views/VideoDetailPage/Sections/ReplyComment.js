import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => {

        let commentNumber = 0;

        props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId){
                commentNumber++;
            }
        })

        setChildCommentNumber(commentNumber)

    }, [props.commentLists]) //댓글 안보이는거 해결책


    const renderReplyComment = (parentCommentId) => 
        props.commentLists.map((comment, index) => (
            <React.Fragment key={index} >
                {
                    comment.responseTo === parentCommentId && //부모Comment와 같은 responseTo를 가진 댓글만 출력 (첫번째 depth댓글은 고려X)
                    <div style={{width: '80%', marginLeft: '40px'}}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} />
                        <ReplyComment refreshFunction={props.refreshFunction} commentLists={props.commentLists} postId={props.videoId} parentCommentId={comment._id} />
                    </div>
                }
            </React.Fragment>
        ))
    

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }

    return (
        <div>
            
            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }
  
            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }

        </div>
    )
}

export default ReplyComment
