import i18n from "i18next";
import {  initReactI18next } from "react-i18next";
import engJSON from './locale/en.json'
import uzJSON from './locale/uz.json'
i18n.use(initReactI18next).init({
    resources: {
        en:{...engJSON},
        uz:{...uzJSON},
    },
    lng: "en",   
});