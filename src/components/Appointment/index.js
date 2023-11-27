import React from "react";
import "components/Appointment/styles.scss";
import useVisualMode from '../../hooks/useVisualMode';

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import Confirm from "components/Appointment/Confirm";
import Status from "components/Appointment/Status";
import Error from "components/Appointment/Error";

export default function Appointment(props) {
  // Define mode constants
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const EDIT = "EDIT";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  // Initialize mode with useVisualMode hook
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // Save function to book an interview
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
  
    transition(SAVING);
  
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }
  
  function destroy() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && (
        <Empty
          onAdd={() => transition(CREATE)} // Transition to CREATE mode when Add button is clicked
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)} // Transition to CONFIRM mode when onDelete is clicked
          onEdit={() => transition(EDIT)} // Transition to EDIT mode when onEdit is clicked
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back} // Transition back to the previous mode when onCancel is clicked
          onSave={save} // Pass the save function to the Form component
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onCancel={back} // Transition back to the previous mode when onCancel is clicked
          onSave={save} // Pass the save function to the Form component
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onCancel={() => transition(SHOW)} // Transition back to SHOW mode when onCancel is clicked
          onConfirm={destroy} // Pass the destroy function to the Confirm component
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not book appointment." onClose={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not cancel appointment." onClose={back} />
      )}
    </article>
  );
}
