package main

import (
	_ "crypto/sha512"
	"encoding/json"
	"fmt"
	"syscall/js"

	api "github.com/dvcrn/maskedemail-cli/pkg"
)

func main() {
	done := make(chan struct{}, 0)
	js.Global().Set("maskedemailList", js.FuncOf(list))
	js.Global().Set("maskedemailCreate", js.FuncOf(create))
	<-done
}

func list(this js.Value, args []js.Value) interface{} {
	token := args[0].String()
	appname := "maskedemail-js"
	clientID := "" // placeholder
	accountID := args[1].String()

	c := api.NewClient(token, appname, clientID)

	// create promise handler
	handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {

		resolve := args[0]
		reject := args[1]

		go func() {
			session, err := c.Session()
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error)
				return
			}

			aliases, err := c.GetAllMaskedEmails(session, accountID)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error)
				return
			}

			js, err := json.Marshal(aliases)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error)
				return
			}

			var out interface{}
			err = json.Unmarshal(js, &out)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error)
				return
			}

			// pass result into promise resolve
			resolve.Invoke(out)
		}()

		return nil
	})

	promiseConstructor := js.Global().Get("Promise")
	return promiseConstructor.New(handler)
}

func create(this js.Value, args []js.Value) interface{} {
	token := args[0].String()
	appname := "test"
	clientID := "" // placeholder
	accountID := args[1].String()
	forDomain := args[2].String()

	c := api.NewClient(token, appname, clientID)

	// create promise handler
	handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {

		resolve := args[0]
		reject := args[1]

		go func() {
			session, err := c.Session()
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error)
				return
			}

			createdEmail, err := c.CreateMaskedEmail(session, accountID, forDomain, true)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error)
				return
			}

			js, err := json.Marshal(createdEmail)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error)
				return
			}

			var out interface{}
			err = json.Unmarshal(js, &out)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error)
				return
			}

			// pass result into promise resolve
			resolve.Invoke(out)
		}()

		return nil
	})

	promiseConstructor := js.Global().Get("Promise")
	return promiseConstructor.New(handler)
}
