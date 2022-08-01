import {Button, Form} from "react-bootstrap";
import type {FormEvent} from "react";
import {useState} from "react";
import {trpc} from '~/utils/trpc';
import {useUserContext} from "~/utils/user";
import Report from './report'

const Questionnaire = () => {
    const [user] = useUserContext();
    const [fullName, setFullName] = useState<string>('')
    const [dob, setDob] = useState<string>('')
    const [happy, setHappy] = useState<number | string>(0)
    const [energetic, setEnergetic] = useState<number | string>(0)
    const [hopefull, setHopefull] = useState<number | string>(0)
    const [sleptHours, setSleptHours] = useState<number | string>(0)
    const [showReport, setShowReport] = useState(false)

    const addUserAnswersMutation = trpc.useMutation(['questionnaire.add'], {
        onSuccess() {
            setShowReport(true)
        }
    })

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        let input = {
            userEmail: user!, fullName: fullName, dob: new Date(dob), happy: Number(happy),
            energetic: Number(energetic), hopefull: Number(hopefull), sleptHours: Number(sleptHours)
        };
        await addUserAnswersMutation.mutateAsync(input)
    }

    return (<>
        {!showReport ? <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Enter your full name</Form.Label>
                <input type="text" required onChange={(e) => setFullName(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Enter your date of birth (mm/dd/yyyy)</Form.Label>
                <input type="date" required onChange={(e) => setDob(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>on a scale from 1-5, how happy do you feel ?</Form.Label>
                <input type="number" min="1" max="5" required onChange={(e) => setHappy(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>on a scale form 1-5, how energetic do you feel ?</Form.Label>
                <input type="number" min="1" max="5" required onChange={(e) => setEnergetic(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>on a scale from 1-5, how hopefull do you feel about the future ?</Form.Label>
                <input type="number" min="1" max="5" required onChange={(e) => setHopefull(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>how many hours have you slept last night ?</Form.Label>
                <input type="number" min="0" max="24" required onChange={(e) => setSleptHours(e.target.value)}/>
            </Form.Group>
            <Form.Group>
                <Button type="submit" variant="primary">Submit</Button>
            </Form.Group>
        </Form> : <Report></Report>
        }
    </>)
};
export default Questionnaire
