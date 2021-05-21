export default ProgressBar = () => {
    return (
        <div className="progress">
            <div
                className="progress-bar progress-bar-info progress-bar-striped"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: progress + "%" }}
            >
                {progress}%
              </div>
        </div>
    );
}