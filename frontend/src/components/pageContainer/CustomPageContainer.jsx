import { PageContainer } from '@toolpad/core'

function CustomPageContainer({ children, ...props }) {

    return (
        <PageContainer
            {...props}
            sx={{
                maxWidth: { xl: 'unset', lg: '94vw', sm: '92vw', xs: '100vw' },
                overflowX: "hidden",
                '& .MuiTypography-root': {
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    textWrap: 'nowrap',
                },
                '& nav .MuiTypography-root, & .MuiBreadcrumbs-separator': {
                    fontSize: { xs: '0.7rem', md: '1rem' },
                    textWrap: 'nowrap',
                    fontFamily: 'nunito'
                },
                '& button .MuiTypography-root': {
                    fontSize: { xs: '0.5rem', md: '0.8rem' },
                    textWrap: 'nowrap',
                    fontFamily: 'nunito'
                },
                '& .MuiBreadcrumbs-li': {
                    display: 'flex',
                    alignItems: 'center'
                }
            }}
        >
            {children}
        </PageContainer>
    )
}

export default CustomPageContainer