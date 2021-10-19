import React, { Component } from 'react'
import './Popup.css'
import CloseButton from 'react-bootstrap/CloseButton'

class Popup extends Component {

    render() {
        return (
            <div>
                {this.props.trigger ?
                    <div className="popup">
                        <div className="popup-inner">
                            <CloseButton aria-label="Hide" disabled onClick={() => {
                                this.props.setTrigger(false)                             
                            }}>                                
                            </CloseButton>
                            {this.props.children}
                        </div>
                    </div>
                    : ""}
            </div>
        )
    }

}

export default Popup;