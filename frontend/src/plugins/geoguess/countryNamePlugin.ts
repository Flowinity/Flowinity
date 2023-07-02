export default {
  install(app) {
    app.config.globalProperties.$countryNameLocale = (isoA2) => {
      return new Intl.DisplayNames(["en_US"], {
        type: "region"
      }).of(isoA2);
    };
  }
};
