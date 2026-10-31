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
    know: t("index.review.know"),
    dontKnow: t("index.review.dontKnow"),
  };

  return (
    <Fragment>
      <ReviewVocaTitle title={reviewVocaTitle} subtitle={reviewVocaSubtitle} />
      <ReviewVocaList texts={reviewVocaListTexts} />
    </Fragment>
  );
}
