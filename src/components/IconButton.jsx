import './IconButton.css';

function IconButton({ icon, title = "button", onClick, small = false, ...buttonProps }) {
    let buttonStyle = {
        'paddingLeft': '16px'
    };
    let iconStyle = {
        'fontSize': '1.3em'
    };
    if (small) {
        buttonStyle['paddingLeft'] = '8px';
        buttonStyle['paddingRight'] = '8px';
        buttonStyle['fontSize'] = 'small';
        buttonStyle['height'] = 'min-content';
        iconStyle['fontSize'] = 'small';
    }
    if (buttonProps.disabled) {
        iconStyle['color'] = 'gray';
    }
    if (title == null) {
        return (
            <span className='icon-button'>
                <button className='d-flex align-items-center' style={buttonStyle} onClick={onClick} {...buttonProps}>
                    <span style={iconStyle} className='material-icons'>{icon}</span>
                </button>
            </span>
        )
    }
    if (icon != null) buttonStyle['paddingLeft'] = small ? '25px' : '37px';
    return (
        <span className='icon-button'>
            <span style={iconStyle} className='icon material-icons'>{icon}</span>
            <button style={buttonStyle} onClick={onClick} {...buttonProps}>
                {title}
            </button>
        </span>
    )
}

export default IconButton