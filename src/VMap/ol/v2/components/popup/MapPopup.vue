<template>
    <div :id="popupId" class="ol-popup">
        <div class="popup_title_div">
            <span
                id="popup-title"
                class="ol-popup-title"
            >{{ title }}</span>
            <span
                id="popup-closer"
                class="ol-popup-closer"
                @click="handleClose"
            ></span>
        </div>
        <div
            :id="contentId"
            class="popup_content"
            v-html="contentHtml"
        >
        </div>
    </div>
</template>

<script>
export default {
    props: {
        popupId:{
            require:true,
            type:String,
            default:''
        },
        title: {
            type: String,
            default: "标题",
        },
        content: {
            type: Object,
            default() {
                return {};
            },
        },
        contentHtml: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            containerId: "ol_popup_" + Math.random().toFixed(6),
            contentId: '',
        };
    },
    created(){
        this.contentId = this.popupId + '_content'
    },
    methods: {
        handleClose() {
            this.$emit("on-close");
            // this.overlay.setPosition(undefined);
            // return false;
        },

        getHtml(data) {
            let html = "<div>";
            data.forEach((element) => {
                const { value, label } = element;
                html += `<div style="display:flex;padding:5px;"><div style="width:70px;text-align:center;">${label}：</div><div style="width:auto;text-align:left;">${value}</div></div>`;
            });

            html += "</div>";
            return html;
        },
    },
};
</script>

<style scoped>
.ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    /* padding: 15px; */
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
}

.popup_title_div {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #409eff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.ol-popup:after,
.ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}

.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}

.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
    color: white;
    font-size: 20px;
}

.ol-popup-closer:after {
    content: "✖";
}

.ol-popup-title {
    position: absolute;
    color: white;
    font-weight: bold;
    top: 0px;
    left: 8px;
}

.popup_content {
    padding: 10px;
    background-color: white;
}
</style>