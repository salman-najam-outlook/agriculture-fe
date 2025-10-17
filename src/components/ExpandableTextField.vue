<template>
    <div :class="[isFocus ? `focusclass` : `unfocusclass`]">
        <input type="text" placeholder="" :value="value" @input="$emit('input', $event.target.value)"
            @focus="handleFocus" @blur="handleBlur" :disabled="disabled" class="search-textbox ib-m ib-el">

    </div>


</template>

<script>
export default {
    /* eslint-disable */
    props: {
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
    ,
    data() {
        return {
            isFocus: false

        }
    },
    methods: {
        handleFocus(e) {
            this.isFocus = true
            this.$emit('expandFocus', e);
        },
        handleBlur() {
            this.isFocus = false
            console.log("blur")
            this.$emit('expandBlur');
        }
    }
}
</script>


<style lang="scss" scoped>
html,
body {
    height: 100%;
    font-size: 24px;
}

html {
    box-sizing: border-box;
}

*,
*:before,
*:after {
    box-sizing: border-box;
}

body {
    min-width: 220px;
    margin: 0;
    line-height: 1.5;
    background-color: #eee;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    color: #333;
}

/* headers */
h1 {
    font-family: "Roboto Slab", Times, "Times New Roman", serif;
    font-size: 2.2em;
}

/* highlight colors */
::-moz-selection {
    background-color: #333;
    color: #fff;
}

::selection {
    background-color: #333;
    color: #fff;
}

/* anchor links */
a {
    text-decoration: none;
    color: coral;
}

a:hover,
a:active {
    text-decoration: underline;
}

/* form elements */
input {
    max-width: 100%;
    padding: 0;
    margin: 0;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    font-weight: 400;
    font-size: 1rem;
    color: #333;
}

input[type=submit],
input[type=button] {
    cursor: pointer;
}

input[type=submit] {
    -webkit-appearance: none;
    -webkit-border-radius: 0;
}

/* ==============================
	$-Modules
============================== */
/* inline block */
.ib {
    display: inline-block;
    vertical-align: top;
}

.ib-m {
    display: inline-block;
    vertical-align: middle;
}


.ib-el {
    font-size: 1rem;
}

/* link colour reset for coloured backgrounds */
.link-reset a {
    text-decoration: underline;
    color: inherit;
}

.link-reset a:hover,
.link-reset a:active {
    text-decoration: none;
}

.link-reset a:visited {
    color: inherit;
}

/* wrapper */
.wrapper {
    max-width: 70ch;
    padding-right: 10px;
    padding-left: 10px;
    margin-right: auto;
    margin-left: auto;
}

/* ==============================
	$-Styles
============================== */
.upper {
    margin-bottom: 1rem;
    text-align: center;
}

.upper h1 {
    margin-top: 0;
    font-size: 1.4em;
    color: teal;
}

.center-ta-c {
    margin-right: 1rem;
    margin-left: 1rem;
}

.search {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    text-align: left;
}

.search-textbox {
    min-width: 50px;
    width: 7.33333%;
    height: 2.5rem;
    padding: 1rem;
    padding-right: 3rem;
    border: 1px solid #ccc;
    font-size: 1rem;
    transition: width 250ms ease-in-out;
    border-radius: 5px;
}

.search-textbox:focus {
    width: 100%;
}

.search-button {
    width: calc(3rem - 2px);
    height: calc(3rem - 5px);
    border: none;
    margin-left: -3rem;
    background-color: #fff;
    font-family: FontAwesome;
    font-style: normal;
    font-size: 1rem;
    transition: opacity 100ms ease-in-out;
}

.search-button:hover {
    opacity: 0.75;
}

.focusclass {
    position: relative;
}

.unfocusclass {
    position: relative;
    width: 70px;
}

/* ==============================
	$-Media-queries
============================== */
@media only screen and (max-width: 1024px) {

    html,
    body {
        font-size: 20px;
    }
}

@media only screen and (max-width: 768px) {

    html,
    body {
        font-size: 18px;
    }
}

@media only screen and (max-width: 480px) {

    html,
    body {
        font-size: 16px;
    }
}
</style>