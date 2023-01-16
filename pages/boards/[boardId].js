import Head from 'next/head'
import Image from 'next/image'
import {getComments} from '../api/boards/[boardId]/comments';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
// prismaはフロントエンドで実行できない;
//api routeを使うかgetserverprops内で使う
// api/boards/boardId/comments
export async function getStaticPaths() {
    return {
      paths: [{ params: { boardId: '1' } }, { params: { boardId: '2' } }],
      fallback: false, // can also be true or 'blocking'
    }
}

export default function board({comments}) {
    console.log(comments);
    return (
        <>
            <main className={styles.main}>
                {comments.map((item, key) => {
                    return (
                        <Card>
                    <CardContent>
                        {item.comment}
                    </CardContent>
                </Card>
                    );
                })}
                
            </main>
        </>
    );
  }


export async function getStaticProps(context) {
    const boardId = context.params.boardId;
    console.log(boardId);
    const comments = await getComments(boardId);
    console.log(comments);
  return {
    props: {comments}, // will be passed to the page component as props
  }
}