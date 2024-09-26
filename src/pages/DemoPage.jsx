import { DemoComponent } from "../components/DemoComponent";

export const DemoPage = () => { // Destructure count from props
  console.log("This is the demo page");

  return (
    <>
      <div>DEMO PAGE</div>
      <DemoComponent />
    </>
  );
};
