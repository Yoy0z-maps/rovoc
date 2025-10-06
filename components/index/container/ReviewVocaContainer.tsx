import { Fragment } from "react";
import ReviewVocaTitle from "../ReviewVocaTitle";
import ReviewVocaList from "../ReviewVocaList";
import { useTranslation } from "react-i18next";

export default function ReviewVocaContainer() {
  const { t } = useTranslation();
  const reviewVocaTitle = t("index.review.title");
  const reviewVocaSubtitle = t("index.review.subtitle");

  const reviewVocaListTexts = {
    noWords: t("index.review.noWords"),
    show: t("index.review.show"),
    hide: t("index.review.hide"),
  };

  return (
    <Fragment>
      <ReviewVocaTitle title={reviewVocaTitle} subtitle={reviewVocaSubtitle} />
      <ReviewVocaList texts={reviewVocaListTexts} />
    </Fragment>
  );
}
