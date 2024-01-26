"useStrict"

export default function StartRating() {
    return(
        <div>
            <div>
                {Array.form({ length: 5}, (_, i) => (
                    <span>M{i + 1}</span>
                ))}
            </div>
            <div>10</div>
        </div>
    );
};