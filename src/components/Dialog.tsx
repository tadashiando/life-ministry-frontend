import { Box, Button, Heading, Layer, Text } from "grommet";
import { useDialogStore } from "../store/dialogStore";

function Dialog(props: {
  show: boolean;
  title: string;
  content: string;
  onSubmit: () => void;
  buttonLabel: string;
}) {
  const { show, title, content, onSubmit, buttonLabel } = props;
  const resetDialog = useDialogStore((store) => store.resetDialog)
  
  return (
    <>
      {show && (
        <Layer position="center" onClickOutside={resetDialog}>
          <Box pad="medium" gap="small" width="medium">
            <Heading level={3} margin="none">
              {title}
            </Heading>
            <Text>{content}</Text>
            <Box
              as="footer"
              gap="small"
              direction="row"
              align="center"
              justify="end"
              pad={{ top: "medium", bottom: "small" }}
            >
              <Button
                label={
                  <Text color="white">
                    <strong>Cancel</strong>
                  </Text>
                }
                onClick={resetDialog}
                secondary
                color="status-critical"
              />
              <Button
                label={
                  <Text color="white">
                    <strong>{buttonLabel}</strong>
                  </Text>
                }
                onClick={onSubmit}
                primary
                color="status-critical"
              />
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
}

export default Dialog;
