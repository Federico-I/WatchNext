"useStrict"

const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
};

const starContainerStyle = {
    display: "flex",
    gap: "4px",
};

const textStyle = {
    lineHeight: "1",
    margin: "0",
}

// Setting default props => function StartRating({ maxRating = 10 })

export default function StartRating({ maxRating = 10 }) {
    

    return(
        <div style={containerStyle}>
            <div style={starContainerStyle}>
                {Array.form({ length: maxRating}, (_, i) => (
                    <span>M{i + 1}</span>
                ))}
            </div>
            <p style={textStyle}>10</p>
        </div>
    );
};