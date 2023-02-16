// import React from 'react'

export const SerializeForm = (form) => {

    const formData = new FormData(form)

    let obj = {}

    for (let [name, value] of formData) {
        // console.log(name);
        // console.log(value);

        obj[name] = value;
    }
    return obj;
    // console.log(obj);
    //   return (
    //     <div>SerializeForm</div>
    //   )
}
