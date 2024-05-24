let tablinks=document.getElementsByClassName("tab-links")
let tabcontents=document.getElementsByClassName("tab-contents")
const opentab=(tabname)=>{
    for (let tablink of tablinks){
        tablink.attributes.class.value="tab-links"
        console.log(tablink)
    }
    for (let tabcontent of tabcontents){
        tabcontent.attributes.class.value="tab-contents" //User instead of tabcontent.classList.remove("active-tab")
        console.log(tabcontent)
    }
    event.currentTarget.classList.add("active-link")
    document.getElementById(tabname).classList.add("active-tab")
}       