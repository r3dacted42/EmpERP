import './IconButton.css';

function IconButton({ icon, title = "button", onClick, small = false, ...buttonProps }) {
    let buttonStyle = {
        'padding-left': '16px'
    };
    let iconStyle = {
        'font-size': '1.3em'
    };
    if (small) {
        buttonStyle['padding-left'] = '8px';
        buttonStyle['padding-right'] = '8px';
        buttonStyle['font-size'] = 'small';
        buttonStyle['height'] = 'min-content';
        iconStyle['font-size'] = 'small';
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
    if (icon != null) buttonStyle['padding-left'] = small ? '25px' : '37px';
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