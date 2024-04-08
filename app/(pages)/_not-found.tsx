'use client'
import { Button } from "../../components/blocks/Button";
import { VerticalPadding } from "../../components/blocks/VerticalPadding";
import { Gutter } from "../../components/blocks/gutter/gutter";
import config from '../../amplifyconfiguration.json';
import { Amplify } from "aws-amplify";

Amplify.configure(config, {
  ssr: true
});


 const NotFound = () => {
  return (
    <Gutter>
      <VerticalPadding top="none" bottom="large">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p>This page could not be found.</p>
        <Button href="/" label="Go Home" appearance="primary" />
      </VerticalPadding>
    </Gutter>
  )
}
export default NotFound;