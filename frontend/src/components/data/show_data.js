import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment-timezone';
import * as actions from '../../actions';
import EditData from './edit_data';
import toastr from 'toastr';
import CommentList from './list_comments';

class ShowData extends Component {

  componentWillMount() {
    this.props.readDataWithComments(this.props.params.id);
  }

  addComment({ comment }) {
    this.props.createCommentForData(this.props.msgComments.data.id, comment);
    this.props.resetForm();
    toastr.success('Comment Saved');
  }

  deleteComment(commentId) {
    this.props.deleteComment(commentId);
    toastr.warning('Comment Deleted')
  }

  vote(message, voteType) {
    this.props.voteOnData(message.id, voteType);
  }

  countVotes(votes) {
    return votes.reduce((total, vote) => {
      if (vote.upVote) { return ++total }
      else { return --total }
    }, 0);
  }

  getItem() {
    if (this.props.msgComments) {
      const message = this.props.msgComments.data;
      return (
        <div className="push-from-top">
          <img
            className="float-right"
            src={message.image}
            width={104}
            height={104} />
          <div className="col-md-2">
            <div
              value={message}
              onClick={() => this.vote(message, true)}
              className="onHover">
              <img src={'../../../images/upvote.png'}
                   height={42} width={42} />
            </div>
            <p className="text-muted votes">
              {this.countVotes(message.votes)}
            </p>
            <div
              value={message}
              onClick={() => this.vote(message, false)}
              className="onHover">
              <img src={'../../../images/downvote.png'}
                   height={42} width={42} />
            </div>
          </div>
          <div className="col-md-6">
            <h4 className="message-title">{message.title}</h4>
            <p className="text-muted comment-list">{message.email}</p>
            <p
              className="text-muted comment-list">
              {moment(message.createdAt).tz("Australia/Sydney")
                .format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>
          <div className="col-md-12">
            <EditData post={this.props.msgComments.data.post} />
            <CommentList
              comments={this.props.msgComments.data.comments}/>
          </div>
        </div>
      );
    }
  }

  render() {
    const { handleSubmit, fields: { comment }} = this.props;
    return (
      <div>
        <div>
          {this.getItem()}
        </div>
        <div className="col-md-12 bottom-margin-108px">
          <form onSubmit={handleSubmit(this.addComment.bind(this))} >
            <fieldset className="form-group pad-top-20">
              <label><strong className="text-color-blue">Add Comment</strong></label>
              <input {...comment} className="form-control" />
            </fieldset>
            <button action="submit"
                    className="btn btn-primary float-right">
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    msgComments: state.auth.msgComments
  };
}

export default reduxForm({
  form: 'addComment',
  fields: ['comment']
}, mapStateToProps, actions)(ShowData);