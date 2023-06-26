import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    FormControl,
    Grid,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import { FormEvent, Key, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doDeposito, getChavesPix, uploadResource } from '../api/api.service'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import toast from 'react-hot-toast';
import { Seo } from '@/components/Seo';

export default function Deposito() {
    const { data, status } = useSession()
    const { caixinha } = useCaixinhaSelect()
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const [arquivos, setArquivo] = useState<any>([])
    const [pix, setPix] = useState<any>(null)
    const [solicitacao, setSolicitacao] = useState({
        valor: 0,
        fileUrl: '',
        memberName: "",
        email: '',
    })

    useEffect(() => {
        if (status === 'authenticated') {
            setSolicitacao({
                ...solicitacao,
                //@ts-ignore
                memberName: data['user']['name'],
                //@ts-ignore
                email: data['user']['email']
            })
        }
    }, [data, status])

    useEffect(() => {
        if (!caixinha)
            return

        getChavesPix(caixinha.id).then(res => {
            if (res) {
                setPix({
                    chave: res.keysPix[0],
                    url: res.urlsQrCodePix[0]
                })
            }
        })
    }, [caixinha])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSolicitacao({ ...solicitacao, [name]: value });
    }

    const request = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        doDeposito({
            caixinhaId: caixinha?.id,
            name: solicitacao.memberName,
            email: solicitacao.email,
            valor: solicitacao.valor
        }).then(() => {
            router.push('/sucesso')
        }).catch(err => {
            console.log(err)
            setLoading(false)
            toast.error(err.message)
        })
    }, [caixinha, solicitacao])

    const addComprovante = () => {
        let input = document.createElement('input');
        input.type = 'file';

        input.addEventListener('change', function (event: any) {
            let arquivo = event.target.files[0];

            console.log('Arquivo selecionado:', arquivo);
            setArquivo([...arquivos, { file: arquivo, name: arquivo.name }])

        });

        input.click()
    }

    const uploadItem = (resource: any) => {
        console.log(resource.name)

        uploadResource(resource.file).then((fileUrl: string) => {
            toast.success('Upload realizado')
            //@ts-ignore
            const novaLista = arquivos.filter(it => it.name !== resource.name)
            novaLista.push({ file: resource, name: resource.name, status: 'success' })
            setArquivo(novaLista)
            setSolicitacao({ ...solicitacao, fileUrl })
        }).catch(e => toast.error(e.message))
    }

    const getChipByItem = (item: any) => {
        if (item.status === 'success') {
            return (
                <Chip key={item.index} label={item?.name} onDelete={() => { alert('adicionado') }} deleteIcon={<CheckIcon />} />
            )
        }

        return (
            <Chip key={item.index} label={item?.name} variant="outlined" onDelete={() => { uploadItem(item) }} deleteIcon={<CloudUploadIcon />} />
        )
    }

    if (isLoading) return <CenteredCircularProgress />

    return (
        <Layout>
            <Seo title="Deposito"/>
            <main>
                <Container maxWidth="lg">
                    <Stack spacing={3}>
                        <div>
                            <Typography variant="h6">
                                Depositando em {caixinha?.name}
                            </Typography>
                        </div>
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                xs={12}
                                md={6}
                                lg={4}
                            >
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

                                            <Box p={2}>

                                                <TextField
                                                    label="Valor depositado"
                                                    id="outlined-start-adornment"
                                                    defaultValue={solicitacao.valor}
                                                    value={solicitacao.valor}
                                                    onChange={handleChange}
                                                    name='valor'
                                                    type='number'
                                                    sx={{ m: 1, width: '25ch' }}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                                    }}
                                                />

                                            </Box>

                                            <Grid item xs={12}>
                                                <Box display="row" gap={2}>
                                                    {arquivos.map((item: { name: string, index: Key }) =>
                                                        getChipByItem(item)
                                                    )}

                                                </Box>
                                                <Box display="flex" gap={2}>

                                                    <Button
                                                        onClick={addComprovante}
                                                        variant="contained"
                                                        color="secondary"
                                                    >
                                                        Adicionar Comprovante
                                                    </Button>
                                                </Box>
                                            </Grid>

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
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                                lg={8}
                            >
                                <Card>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                alignItems: 'center',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <Avatar
                                                src={pix?.url}
                                                sx={{
                                                    height: 400,
                                                    mb: 2,
                                                    width: 400
                                                }}
                                            />
                                            <Typography
                                                color="text.secondary"
                                                variant="body2"
                                            >
                                                Chave pix {pix?.chave}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <Divider />
                                </Card>
                            </Grid>
                        </Grid>
                    </Stack>
                </Container>
            </main>
        </Layout>
    )
}
