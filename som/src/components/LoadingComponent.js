//  to display a loading spinner on the screen just to keep the user informed about the fact that something is being loaded from somewhere.
// This component can be used when you need to load something
import React from 'react';

export const Loading = () => {
    return (
        <div className="col-12">
            <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
            <p>Loading . . . </p>
        </div>
    );
};