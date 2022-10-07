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

	js.Global().Set("maskedemailSession", js.FuncOf(session))
	js.Global().Set("maskedemailList", js.FuncOf(list))
	js.Global().Set("maskedemailCreate", js.FuncOf(create))
	js.Global().Set("maskedemailEnable", js.FuncOf(enable))
	js.Global().Set("maskedemailDisable", js.FuncOf(disable))
	js.Global().Set("maskedemailEnableById", js.FuncOf(enableByID))
	js.Global().Set("maskedemailDisableById", js.FuncOf(disableByID))
	<-done
}

func remarshalInterface(in interface{}) (interface{}, error) {
	js, err := json.Marshal(in)
	if err != nil {
		return nil, err
	}

	var out interface{}
	err = json.Unmarshal(js, &out)
	if err != nil {
		return nil, err
	}

	return out, nil
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
				fmt.Println(err.Error())
				return
			}

			aliases, err := c.GetAllMaskedEmails(session, accountID)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error())
				return
			}

			out, err := remarshalInterface(aliases)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error())
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
				fmt.Println(err.Error())
				return
			}

			createdEmail, err := c.CreateMaskedEmail(session, accountID, forDomain, true)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error())
				return
			}

			out, err := remarshalInterface(createdEmail)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error())
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

type action int

const (
	actionEnable action = iota
	actionDisable
)

func updateEmailStateByID(this js.Value, args []js.Value, action action) interface{} {
	token := args[0].String()
	appname := "test"
	clientID := "" // placeholder
	accountID := args[1].String()
	maskedEmailID := args[2].String()

	c := api.NewClient(token, appname, clientID)

	// create promise handler
	handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		resolve := args[0]
		reject := args[1]

		go func() {
			session, err := c.Session()
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error())
				return
			}

			var res interface{}
			if action == actionEnable {
				res, err = c.EnableMaskedEmailByID(session, accountID, maskedEmailID)
				if err != nil {
					reject.Invoke(err.Error())
					fmt.Println(err.Error())
					return
				}

			} else {
				res, err = c.DisableMaskedEmailByID(session, accountID, maskedEmailID)
				if err != nil {
					reject.Invoke(err.Error())
					fmt.Println(err.Error())
					return
				}

			}

			out, err := remarshalInterface(res)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error())
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

func updateEmailState(this js.Value, args []js.Value, action action) interface{} {
	token := args[0].String()
	appname := "test"
	clientID := "" // placeholder
	accountID := args[1].String()
	maskedEmail := args[2].String()

	c := api.NewClient(token, appname, clientID)

	// create promise handler
	handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		resolve := args[0]
		reject := args[1]

		go func() {
			session, err := c.Session()
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error())
				return
			}

			var res interface{}
			if action == actionEnable {
				res, err = c.EnableMaskedEmail(session, accountID, maskedEmail)
				if err != nil {
					reject.Invoke(err.Error())
					fmt.Println(err.Error())
					return
				}

			} else {
				res, err = c.DisableMaskedEmail(session, accountID, maskedEmail)
				if err != nil {
					reject.Invoke(err.Error())
					fmt.Println(err.Error())
					return
				}

			}

			out, err := remarshalInterface(res)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error())
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

func enableByID(this js.Value, args []js.Value) interface{} {
	return updateEmailStateByID(this, args, actionEnable)
}

func disableByID(this js.Value, args []js.Value) interface{} {
	return updateEmailStateByID(this, args, actionDisable)
}

func enable(this js.Value, args []js.Value) interface{} {
	return updateEmailState(this, args, actionEnable)
}

func disable(this js.Value, args []js.Value) interface{} {
	return updateEmailState(this, args, actionDisable)
}

func session(this js.Value, args []js.Value) interface{} {
	token := args[0].String()
	appname := "test"
	clientID := "" // placeholder

	c := api.NewClient(token, appname, clientID)

	// create promise handler
	handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		resolve := args[0]
		reject := args[1]

		go func() {
			session, err := c.Session()
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error())
				return
			}

			out, err := remarshalInterface(session)
			if err != nil {
				reject.Invoke(err.Error())
				fmt.Println(err.Error())
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
