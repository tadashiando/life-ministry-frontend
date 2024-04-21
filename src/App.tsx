import {
  Box,
  Button,
  Calendar,
  DropButton,
  Grid,
  Grommet,
  Header,
  Page,
  PageContent,
  Text,
} from "grommet";
import {
  format,
  startOfISOWeek,
  endOfISOWeek,
  eachDayOfInterval,
  getWeek,
  getYear,
  getDay,
} from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useState, PropsWithChildren, useRef, useEffect } from "react";
import Translator from "./components/Translator";
import { theme } from "./theme";
import MeetingForm from "./MeetingForm";
import Dialog from "./components/Dialog";
import { useDialogStore } from "./store/dialogStore";
import { Part } from "./types/Part";
import { Section } from "./types/Section";
import { Meetings } from "./enums/Meetings";
import api from "./services/services";

function App() {
  const [calDate, setCalDate] = useState(new Date().toISOString());
  const [isSunday, setIsSunday] = useState(false);

  const [treasuresValue, setTreasuresValue] = useState<Section>({
    section: Meetings.TREASURES,
    value: [],
  });
  const treasuresRef = useRef<HTMLFormElement>(null);
  const [applyYourselfValue, setApplyYourselfValue] = useState<Section>({
    section: Meetings.APPLY_YOURSELF,
    value: [],
  });
  const applyYourselfRef = useRef<HTMLFormElement>(null);
  const [livingChristiansValue, setLivingChristiansValue] = useState<Section>({
    section: Meetings.CHRISTIAN_LIFE,
    value: [],
  });
  const christianLifeRef = useRef<HTMLFormElement>(null);

  const { show, title, description, action } = useDialogStore((state) => state);
  const showDialog = useDialogStore((store) => store.showDialog);
  const resetDialog = useDialogStore((store) => store.resetDialog);

  const formattedYear = getYear(calDate);
  const weekNumber = isSunday ? getWeek(calDate) - 1 : getWeek(calDate); // Condition following JW Week (First day Monday, last day Sunday)

  const calendarWeekFNS = eachDayOfInterval({
    start: startOfISOWeek(calDate),
    end: endOfISOWeek(calDate),
  });

  const calendarWeek = calendarWeekFNS.map((date) => {
    return date.toISOString();
  });

  const weekTitle = `${format(calendarWeek.at(0)!, "PPP", {
    locale: ptBR,
  })} - ${format(calendarWeek.at(6)!, "PPP", {
    locale: ptBR,
  })}`;

  const changeWeekConfirm = (date: string) => {
    showDialog(
      "Change Week",
      "If you change the week, all parts will be reseted. Are you sure?",
      () => changeWeek(date)
    );
  };

  const changeWeek = async (date: string) => {
    const localeDate = date.toLocaleString();
    await setIsSunday(getDay(localeDate) === 0);
    setCalDate(localeDate);
    resetWeek();
  };

  const findAndUpdate = (
    state: Section,
    setState: (state: Section) => void,
    value: Part
  ) => {
    const foundIndex =
      state && state.value.findIndex((x) => x.index == value.index);
    state.value[foundIndex < 0 ? value.index : foundIndex] = value;
    setState(state);
  };

  const resetAll = () => {
    showDialog(
      "Reset All Parts",
      "Are you sure you wanna reset the whole week?",
      resetWeek
    );
  };

  const resetWeek = () => {
    setTreasuresValue({ section: Meetings.TREASURES, value: [] });
    treasuresRef?.current?.reset();
    setApplyYourselfValue({ section: Meetings.APPLY_YOURSELF, value: [] });
    applyYourselfRef?.current?.reset();
    setLivingChristiansValue({ section: Meetings.CHRISTIAN_LIFE, value: [] });
    christianLifeRef?.current?.reset();
    resetDialog();
  };

  const submitAll = () => {
    showDialog(
      "Submit Meeting",
      "Are you sure you wanna submit this week?",
      submitMeeting
    );
  };

  const submitMeeting = () => {
    postMeeting();
  };

  useEffect(() => {
    getMeeting();
  }, [calDate]);

  const getMeeting = () => {
    console.log("Year: ", formattedYear);
    console.log("Week: ", weekNumber);

    api
      .get(`/meetings/${formattedYear}${weekNumber}`)
      .then((response) => {
        if (response) {
          const data = response.data?.props;
          if (data) {
            setTreasuresValue(data.treasures);
            setApplyYourselfValue(data.applyYourself);
            setLivingChristiansValue(data.christianLife);
          }
        }
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  };

  const postMeeting = () => {
    api
      .post(`/meetings/${formattedYear}${weekNumber}`, {
        treasures: treasuresValue,
        applyYourself: applyYourselfValue,
        christianLife: livingChristiansValue,
      })
      .then(function (response) {
        console.log(response);
        resetDialog();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <Grommet theme={theme} full>
      <Page>
        <AppBar>
          <Grid columns={["3/4", "1/4"]} fill="horizontal">
            <Box justify="center">
              <Text size="xlarge">
                <Translator path="home.lifeMinistry" />, {weekTitle}
              </Text>
            </Box>
            <Box>
              <DropButton
                label={<Translator path="home.selectWeek" />}
                primary
                color={{
                  dark: "graph-3",
                  light: "#004535",
                }}
                size="large"
                dropContent={
                  <Calendar
                    onSelect={(date) => changeWeekConfirm(date as string)}
                    dates={calendarWeek}
                    locale="pt-BR"
                    firstDayOfWeek={1}
                    daysOfWeek
                    alignSelf="center"
                    fill
                  />
                }
              />
            </Box>
          </Grid>
        </AppBar>
        <PageContent>
          <MeetingForm
            section={Meetings.TREASURES}
            reference={treasuresRef}
            key="treasures"
            data={treasuresValue}
            onPartChange={(value: Part) =>
              findAndUpdate(treasuresValue, setTreasuresValue, value)
            }
          />
          <MeetingForm
            section={Meetings.APPLY_YOURSELF}
            reference={applyYourselfRef}
            key="applyYourself"
            data={applyYourselfValue}
            onPartChange={(value: Part) =>
              findAndUpdate(applyYourselfValue, setApplyYourselfValue, value)
            }
          />
          <MeetingForm
            section={Meetings.CHRISTIAN_LIFE}
            reference={christianLifeRef}
            key="livingChristians"
            data={livingChristiansValue}
            onPartChange={(value: Part) =>
              findAndUpdate(
                livingChristiansValue,
                setLivingChristiansValue,
                value
              )
            }
          />
          <Box
            direction="row"
            justify="end"
            margin={{ top: "medium", bottom: "medium" }}
            background={{ color: { dark: "rgba(0, 115, 157, 0.2)" } }}
            pad="10px"
          >
            <Button label="Reset" margin="5px" onClick={resetAll} />
            <Button label="Submit" primary margin="5px" onClick={submitAll} />
          </Box>
        </PageContent>
      </Page>
      <Dialog
        show={show}
        title={title}
        content={description}
        onSubmit={action}
        buttonLabel="Reset"
      />
    </Grommet>
  );
}

const AppBar = (props: PropsWithChildren) => (
  <Header
    background="brand"
    pad={{ left: "medium", right: "medium", vertical: "medium" }}
    elevation="medium"
    {...props}
  />
);

export default App;
