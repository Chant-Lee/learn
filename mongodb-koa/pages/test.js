import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Axios from 'axios'

class Test extends Component {
	constructor (props) {
		super(props);
		this.state = {
			showTooltip: false  // 控制 tooltip 的显示隐藏
		}
  }
  componentDidMount () {

  }
  getAllUser () {
    Axios.get({})
  }
  render () {
    <div class='test_koa'>

    </div>
  }
}