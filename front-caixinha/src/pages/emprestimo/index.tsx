import Head from 'next/head'
import { Inter } from 'next/font/google'
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputAdornment,
    TextField,
} from "@mui/material"
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doEmprestimo } from '../api/api.service'

const inter = Inter({ subsets: ['latin'] })

export default function Emprestimo() {
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const [solicitacao, setSolicitacao] = useState({
        valor: 0,
        juros: 0,
        parcela: 0,
        motivo: "",
        memberName: "",
        email: '',
    })

    const { user } = router.query

    useEffect(() => {
        if (user) {
            setSolicitacao({ ...solicitacao, memberName: user as string })
        }
    }, [user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSolicitacao({ ...solicitacao, [name]: value });
    }

    const request = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        doEmprestimo(solicitacao).then(() => {
            router.push('/sucesso')
        }).catch(err => {
            alert('houve um problema cheque o log no console')
            console.log(err)
            setLoading(false)
        })
    }

    if (isLoading) return <p>Loading...</p>

    return (
        <>
            <Head>
                <title>Caixinha</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Box p={2}>
                    <form onSubmit={request}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        required
                                        name="memberName"
                                        label="nome"
                                        disabled={true}
                                        value={solicitacao.memberName}
                                        defaultValue={solicitacao.memberName}
                                        onChange={handleChange}
                                        inputProps={{ "data-testid": "name" }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        required
                                        name="email"
                                        label="email"
                                        type='email'
                                        value={solicitacao.email}
                                        defaultValue={solicitacao.email}
                                        onChange={handleChange}
                                        inputProps={{ "data-testid": "name" }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Motivo"
                                        name='motivo'
                                        multiline
                                        value={solicitacao.motivo}
                                        rows={4}
                                        defaultValue={solicitacao.motivo}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Grid>

                            <Box p={2}>

                                <TextField
                                    label="Valor solicitado"
                                    id="outlined-start-adornment"
                                    defaultValue={solicitacao.valor}
                                    value={solicitacao.valor}
                                    onChange={handleChange}
                                    name='valor'
                                    sx={{ m: 1, width: '25ch' }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    }}
                                />
                                <TextField
                                    label="Juros a ser pago"
                                    id="outlined-start-adornment"
                                    onChange={handleChange}
                                    name='juros'
                                    value={solicitacao.juros}
                                    sx={{ m: 1, width: '25ch' }}
                                    defaultValue={solicitacao.juros}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                />
                                <TextField
                                    onChange={handleChange}
                                    name='parcela'
                                    value={solicitacao.parcela}
                                    label="Quantidade de parcelas"
                                    id="outlined-start-adornment"
                                    sx={{ m: 1, width: '25ch' }}
                                    defaultValue={solicitacao.parcela}
                                />

                            </Box>

                            <Grid item xs={12}>
                                <Box display="flex" gap={2}>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Enviar
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </main>
        </>
    )
}
