import { NextPageWithLayout } from './_app';
import Header from '~/components/header';
import Questionnaire from "~/components/questionnaire";

const IndexPage: NextPageWithLayout = () => {
  return (
    <>
      <Header></Header>
        <Questionnaire></Questionnaire>
      <hr />
    </>
  );
};

export default IndexPage;

