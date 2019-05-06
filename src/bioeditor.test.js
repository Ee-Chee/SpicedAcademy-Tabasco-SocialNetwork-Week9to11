import React from "react";
import { shallow } from "enzyme";
import BioEditor from "./bioeditor";
import axios from "./axios";

jest.mock("./axios");

test("Add is rendered when no bio is passed", () => {
    const wrapper = shallow(<BioEditor />);
    expect(wrapper.find("button").length).toBe(1);
    expect(wrapper.find("button").text()).toEqual("Add your bio now!");
    //.length here refers to how many button elements available
});

//test.only(...) is used to run for a particular selected test of this file
test("Edit is rendered when a bio text is passed", () => {
    const wrapper = shallow(
        <BioEditor bioData="some random text for bio testing" />
    );
    expect(wrapper.find("button").length).toBe(1);
    expect(wrapper.find("button").text()).toEqual("Edit");
});
//"Edit" string is case sensitive

test("clicking Add or Edit button causes textarea and Save button to be rendered", () => {
    const wrapper = shallow(
        <BioEditor bioData="some random text for bio testing" />
    );
    wrapper.find("button").simulate("click");
    expect(wrapper.find("textarea").length).toBe(1);
    expect(wrapper.find("button").text()).toEqual("Save");

    const wrapper2 = shallow(<BioEditor />);
    wrapper2.find("button").simulate("click");
    expect(wrapper2.find("textarea").length).toBe(1);
    expect(wrapper2.find("button").text()).toEqual("Save");
});

///////////////////////////////////////////////4th and 5th test
test("When axios request is successful, the function that was passed as a prop to the component gets called.", async () => {
    axios.post.mockResolvedValue({
        data: {
            rows: [{ biotext: "random text" }]
        }
    });
    const mockFn = jest.fn();
    const wrapper = shallow(<BioEditor bioHandler={mockFn} />);
    await wrapper.instance().submit();
    expect(mockFn.mock.calls.length).toBe(1);
});

//Very often you want to write tests to confirm that your code is causing functions to be called at the right time and in the right way.
//For example, you might wish to confirm that an event handler is actually being called whenever the event occurs or that a callback is called with the correct arguments.
