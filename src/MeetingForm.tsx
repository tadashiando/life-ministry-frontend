import { RefObject, useEffect, useState } from "react";

import {
  Box,
  Form,
  Button,
  FormField,
  Heading,
  Grid,
  TextInput,
  Select,
  Text,
} from "grommet";
import { Add, Trash } from "grommet-icons";
import Translator from "./components/Translator";
import { useDialogStore } from "./store/dialogStore";
import { Part } from "./types/Part";
import { Section } from "./types/Section";
import { applyFieldMinistryParts } from "./assets/data/applyFieldMinistry";
import i18next from "i18next";

const MeetingForm = ({
  section,
  onPartChange,
  data,
  reference,
}: {
  section: number;
  onPartChange: (value: Part) => void;
  reference: RefObject<HTMLFormElement>;
  data: Section;
}) => {
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionColor, setSectionColor] = useState("");

  const showDialog = useDialogStore((store) => store.showDialog);
  const resetDialog = useDialogStore((store) => store.resetDialog);

  useEffect(() => {
    switch (section) {
      case 1:
        setSectionTitle("section.treasures");
        setSectionColor("#2a6b77");
        break;

      case 2:
        setSectionTitle("section.applyYourself");
        setSectionColor("#9b6d17");
        break;

      case 3:
        setSectionTitle("section.livingChristians");
        setSectionColor("#942926");
        break;

      default:
        break;
    }
  }, [section]);

  useEffect(() => {
    if (data) {
      setSection({
        section: data.section,
        value: data.value,
      });
    }
  }, [data]);

  const [meetingSection, setSection] = useState<Section>({
    section: undefined,
    value: [],
  });

  const resetValues = () => {
    setSection({
      section: undefined,
      value: [],
    });
    resetDialog();
    reference?.current?.reset();
  };

  const addPart = () => {
    const newPart = { index: 0, partName: "" };
    const newParts = [...meetingSection.value, newPart];
    setSection({
      ...meetingSection,
      value: newParts,
    });
    console.log(meetingSection);
  };

  const removePart = (index: number) => {
    if (meetingSection.value && meetingSection.value.length > 0) {
      setSection({
        ...meetingSection,
        value: meetingSection.value.filter((v, _idx) => _idx !== index),
      });
    }
  };

  const renderApplyFieldMinistryPart = (part: Part) => (
    <Text>{part.partName}</Text>
  );

  let partsGroup = null;
  if (meetingSection.value !== undefined) {
    partsGroup = meetingSection.value.map((part, index) => (
      <Grid
        columns={["3/4", "1/4"]}
        fill="horizontal"
        align="center"
        key={index}
      >
        <FormField
          name={`partNames[${index}]`}
          placeholder={<Translator path="section.partName" />}
          onBlur={(e) => onPartChange({ index, partName: e.target.value })}
        >
          {section === 2 ? (
            <Select
              options={applyFieldMinistryParts(i18next.language)}
              placeholder="Select a Part"
              defaultValue={
                <Translator path={`applyFieldMinistry.${part.slug}`} />
              }
            >
              {renderApplyFieldMinistryPart}
            </Select>
          ) : (
            <TextInput placeholder="type here" defaultValue={part.partName} />
          )}
        </FormField>

        <Box>
          <Button
            icon={<Trash />}
            plain
            hoverIndicator
            onClick={() => removePart(index)}
            margin={{ left: "medium" }}
          />
        </Box>
      </Grid>
    ));
  }

  return (
    <>
      <Box fill>
        <Form ref={reference} value={meetingSection} validate="blur">
          <Heading level={4} style={{ backgroundColor: sectionColor }}>
            <Translator path={sectionTitle!} />
          </Heading>
          {partsGroup}
          <Button
            icon={<Add />}
            label={<Translator path="section.add" />}
            plain
            hoverIndicator
            onClick={addPart}
            margin={{ top: "medium" }}
          />
          <Box direction="row" gap="small" margin={{ top: "medium" }}>
            <Button
              label="Reset"
              secondary
              color={{
                dark: "status-critical",
                light: "status-critical",
              }}
              onClick={() =>
                showDialog(
                  "Reset Meeting",
                  "Are you sure you wanna reset this section?",
                  resetValues
                )
              }
            />
          </Box>
        </Form>
      </Box>
    </>
  );
};

export default MeetingForm;
