import React from 'react';
import RibbonCard from "../../common/forms/RibbonCard";
import ARMButton from "../../common/buttons/ARMButton";

const FIleUploadErrors = ({errors, setErrors}) => {
    return (
        <RibbonCard ribbonText={"Error Details"} bgColor={"red"}>
            <div style={{height: "46vh", overflowX: 'auto'}}>
                {
                    errors?.map((data, index) => (
                            <p key={index}>{data}</p>
                        )
                    )
                }
                <ARMButton
                    type="primary"
                    style={{
                        float: 'right',
                        marginBottom: '2%',
                        marginRight: '12%'
                    }}
                    onClick={() => setErrors([])}
                >
                    Close
                </ARMButton>
            </div>
        </RibbonCard>
    );
};

export default FIleUploadErrors;