import './TextInput.css'

function TextInput({ icon = "alternate_email", placeholder, type, iconEnd = null, iconEndHover, iconEndColor, ...inputProps }) {
    let inputStyle = {
        'paddingLeft': '4px',
        'paddingRight': '4px'
    };
    if (icon != null) inputStyle['paddingLeft'] = '32px';
    if (iconEnd != null) inputStyle['paddingRight'] = '32px';
    let iconEndStyle = {};
    if (iconEndColor) iconEndStyle['color'] = iconEndColor;
    return (
        <span className='text-input'>
            <span className="icon-start material-icons">{icon}</span>
            <input style={inputStyle} type={type} placeholder={placeholder} {...inputProps}></input>
            <span className="icon-end material-icons" title={iconEndHover} style={iconEndStyle}>{iconEnd}</span>
        </span>
    )
}

export default TextInput