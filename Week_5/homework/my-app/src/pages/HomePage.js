import { useEffect, useState, Fragment, useContext } from "react";
import { FaPlus } from "react-icons/fa";
import AuthContext from "../contexts/AuthContext.js";

import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  createStyles,
  useMantineTheme,
  Group,
  Center,
  Stack,
  Input,
  Button,
  Checkbox,
  Title,
  JsonInput
} from "@mantine/core";

export default function HomePage() {
  // toDo: an array of tasks that need to be done; setToDo: a function that allows you to modify the task variable.

  const [tasks, setTasks] = useState([
    { name: "create a todo app", finished: false },
    { name: "wear a mask", finished: false },
    { name: "play roblox", finished: false },
    { name: "be a winner", finished: false },
    { name: "become a tech bro", finished: false }
  ]);

  // taskName: a string of the name of task that you want to add; setToDo: a function that allows you to edit the taskName
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    const initialTasks = async () =>
      await fetch("https://tpeo-todo.herokuapp.com/todo/", {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + `${localStorage.getItem("Token")}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
      })
        .then((response) => {
          if (response.status > 205) {
            throw new Error();
          }
          return response.json();
        })
        .then((data) => {
          const newData = data.map((d) => {
            d.finished = false;
            d.id = data.uid;
            return d;
          });
          setTasks(newData);
        })
        .catch((e) => {
          console.log(e);
        });
    initialTasks();
  }, []);

  // addTask: adds a task to toDo by adding the taskName
  async function addTask() {
    // makes sure that taskName is not blank
    if (taskName) {
      // makes sure that taskName is a new task
      if (tasks.includes(taskName)) {
        alert("Task already exists");
      } else {
        await fetch("https://tpeo-todo.herokuapp.com/todo/", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${localStorage.getItem("Token")}`
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify({ todo: taskName })
        })
          .then((response) => {
            console.log(response.status);
            if (response.status > 205) {
              throw new Error();
            }
            return response.json();
          })
          .then((data) => {
            setTasks(
              tasks.concat({ todo: taskName, uid: data.uid, finished: false })
            );
            setTaskName("");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }

  async function updateTask(name) {
    // In class TODO: implement update task
    let changedTask = {};
    const newTasks = tasks.map((e) => {
      if (e.todo === name.todo) {
        e.finished = !e.finished;
        changedTask = e;
      }
      return e;
    });
    setTasks(newTasks);
    if (changedTask.finished === true) {
      await fetch("https://tpeo-todo.herokuapp.com/todo/", {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + `${localStorage.getItem("Token")}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ uid: changedTask.uid })
      });
    } else {
      await fetch("https://tpeo-todo.herokuapp.com/todo/", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + `${localStorage.getItem("Token")}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ todo: changedTask.todo })
      }).catch((e) => {
        console.log(e);
      });
    }
  }

  function getSummary() {
    let unfinishedTasks = 0;
    tasks.forEach((task) => {
      if (task.finished === false) {
        unfinishedTasks += 1;
      }
    });
    if (unfinishedTasks === 1) {
      return <Title order={2}>You have 1 unfinished task</Title>;
    } else if (unfinishedTasks >= 1) {
      return (
        <Title order={2}>You have {unfinishedTasks} tasks left to do</Title>
      );
    }
  }

  return (
    <Stack align="center" justify="center" p="xl">
      {getSummary()}
      <Group>
        <Input
          value={taskName}
          placeholder="Type your task here"
          onChange={(event) => setTaskName(event.target.value)}
        ></Input>
        <Button rightIcon={<FaPlus />} onClick={() => addTask()}>
          Add
        </Button>
      </Group>
      <Stack>
        {tasks.map((task, index) => (
          <Checkbox
            checked={task.finished}
            key={task.uid}
            index={index}
            label={task.todo}
            onChange={() => updateTask(task)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
