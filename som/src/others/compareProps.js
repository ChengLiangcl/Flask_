function compareProps(currentMetadata, nextMetadata, currentModelFiles, nextModelFiles) {

    //console.log("compareMetadata: ", currentMetadata);
    //console.log("nextMetadata: ", nextMetadata);
    //console.log("nextBriefInfo: ", nextMetadata['BriefInfo']);
    const compareBriefInfo = (currentMetadata.BriefInfo !== nextMetadata.BriefInfo) ? true : false;
    const compareDescription = (currentMetadata.Description !== nextMetadata.Description) ? true : false;
    const compareSource = (currentMetadata.Source !== nextMetadata.Source) ? true : false;
    const compareNumber_of_Instance = (currentMetadata.Number_of_Instance !== nextMetadata.Number_of_Instance) ? true : false;
    const compareNumber_of_Attribute = (currentMetadata.Number_of_Attribute !== nextMetadata.Number_of_Attribute) ? true : false;
    const compareLabel = (currentMetadata.Label !== nextMetadata.Label) ? true : false;

    const compareKeyWords = (currentKeywords, nextKeywords) => {
        // if their lengths are different, meaning keywords got changed, so needs to be updated
        if (currentKeywords.length !== nextKeywords.length) {
            return true;
        }
        else {
            // if some content in those kywords are different, then needs to update
            const result = currentKeywords.map((value, index) => {
                return value !== nextKeywords[index] ? "update" : "noUpdate"
            });

            return result.includes("update");
        }
    };

    const compareAttributes = (currentAttributes, nextAttributes) => {
        if (currentAttributes.length !== nextAttributes.length) {
            return true;
        }
        else {
            const attr_result = currentAttributes.map((eachValue, index) => {
                return Object.values(eachValue).map((eachAttr, attrIndex) => {
                    return eachAttr !== Object.values(nextAttributes[index])[attrIndex] ? "update" : "noUpdate";
                })
            });

            const attr_result_final = attr_result.map(eachResult => {
                return eachResult.includes("update") ? "update" : "noUpdate";
            });
            return attr_result_final.includes("update");
        }
    };

    const compareModelFiles = (currentModelFiles, nextModelFiles) => {
        if (currentModelFiles.length !== nextModelFiles.length) {
            return true;
        }
        else {
            const attr_result = currentModelFiles.map((eachValue, index) => {
                return Object.values(eachValue).map((eachAttr, attrIndex) => {
                    return eachAttr !== Object.values(nextModelFiles[index])[attrIndex] ? "update" : "noUpdate";
                })
            });

            const attr_result_final = attr_result.map(eachResult => {
                return eachResult.includes("update") ? "update" : "noUpdate";
            });
            console.log("briefInfo result: ", attr_result);
            return attr_result_final.includes("update");
        }
    };


    // compare model files
    // const compareModelFiles = (currentModelFiles, nextModelFiles) => {
    //     console.log("currentModelFiles: ", currentModelFiles);
    //     console.log("nextModelFiles: ", nextModelFiles);

    //     if(currentModelFiles.length !== nextModelFiles.length){
    //         console.log("because of model files");
    //         return true
    //     }
    //     else if (currentModelFiles.length !== 0 && nextModelFiles.length !== 0){
    //         console.log("check current model: ", currentModelFiles);
    //         console.log("check next model: ", nextModelFiles[0]);
    //         const BriefInfo_result = currentModelFiles.map((eachModel, index) => {
    //             console.log("current briefInfo: ", eachModel.BriefInfo);
    //             console.log("next briefInfo1: ", nextModelFiles[index]);
    //             const nextmodel = nextModelFiles[index];
    //             console.log("next brirfInfo: ", nextmodel.BriefInfo);
    //             return eachModel.BriefInfo !== nextModelFiles[index]["BriefInfo"] ? "update" : "noUpdate";
    //         });
    //         console.log("model result: ", BriefInfo_result);

    //         return BriefInfo_result.includes("update");
    //     }
    // }

    // console.log(`compareBriefInfo: ${compareBriefInfo}`);
    // console.log(`compareDescription: ${compareDescription}`);
    // console.log(`compareSource: ${compareSource}`);
    // console.log(`compareNumber_of_Instance: ${compareNumber_of_Instance}`);
    // console.log(`compareNumber_of_Attribute: ${compareNumber_of_Attribute}`);
    // console.log(`compareLabel: ${compareLabel}`);
    // console.log(`compareKeyWords: ${compareKeyWords(currentMetadata.Keywords, nextMetadata.Keywords)}`);
    // console.log(`compareAttributes: ${compareAttributes(currentMetadata.AttrInfo, nextMetadata.AttrInfo)}`);
    //console.log(`compareModelFiles ${compareModelFiles(currentModelFiles, nextModelFiles)}`);

    //different matadata's length means the user changed metadata just now, the system needs to be updated
    /** 
    if (currentMetadata.length !== nextMetadata.length) {
        return true;
    }*/
    // different content of metadata means updating
    if (compareBriefInfo || compareDescription || compareSource || compareNumber_of_Instance ||
        compareNumber_of_Attribute || compareLabel || compareKeyWords(currentMetadata.Keywords, nextMetadata.Keywords) ||
        compareAttributes(currentMetadata.AttrInfo, nextMetadata.AttrInfo) || compareModelFiles(currentModelFiles, nextModelFiles)) {
        return true
    }
    // no different content of metadata means no updating
    else {
        return false;
    }
}

export default compareProps;