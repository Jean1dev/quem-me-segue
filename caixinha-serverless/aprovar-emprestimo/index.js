const middleware = require('../utils/middleware')
const { Box, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')
const { resolveCircularStructureBSON } = require('../utils')

async function aprovarEmprestimo(context, req) {
    const { memberName, emprestimoId, caixinhaid } = req.body
    const collectionName = 'caixinhas'


    await connect()
    const caixinhaEntity = await getByIdOrThrow(caixinhaid, collectionName)

    const domain = Box.fromJson(caixinhaEntity)

    const emprestimo = domain.getLoanByUUID(emprestimoId)

    emprestimo.addApprove(new Member(memberName))
    if (emprestimo.isApproved) {
        const uuidAdicionados = []
        domain['loans'] = domain['loans'].filter(iterator => {
            if (uuidAdicionados.includes(iterator.uid)) {
                return false
            }

            uuidAdicionados.push(iterator.uid)
            return true
        })
    }

    await replaceDocumentById(caixinhaEntity._id, collectionName, resolveCircularStructureBSON(domain))
}

module.exports = async (context, req) => await middleware(context, req, aprovarEmprestimo)