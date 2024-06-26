import { Suspense } from 'react';
import Linkify from 'react-linkify';

import Attachment from '../Attachment/Attachment';
import * as S from './style';
import { IndexedMessage } from '../../types';

function Link(
  decoratedHref: string,
  decoratedText: string,
  key: number,
): React.ReactNode | undefined {
  return (
    <a key={key} target="_blank" rel="noopener noreferrer" href={decoratedHref}>
      {decoratedText}
    </a>
  );
}

interface IMessage {
  message: IndexedMessage;
  color: string;
  isActiveUser: boolean;
  sameAuthorAsPrevious: boolean;
}

function Message({
  message,
  color,
  isActiveUser,
  sameAuthorAsPrevious,
}: IMessage) {
  const isSystem = !message.author;
  const dateTime = message.date.toISOString().slice(0, 19).replace('T', ' ');

  // Function to format message with attachment object
  const formatMessage = (message: IndexedMessage) => {
    
    if (message.message.includes('.pdf (file attached)')) {
      const fileName = message.message.split('.pdf')[0];
      return {
        ...message,
        attachment: {
          fileName: fileName + ".pdf"
        },
      };
    }
    return message;
  };

  // Format the message
  const formattedMessage = formatMessage(message);
  

  return (
    <S.Item
      isSystem={isSystem}
      isActiveUser={isActiveUser}
      sameAuthorAsPrevious={sameAuthorAsPrevious}
    >
      <S.Bubble isSystem={isSystem} isActiveUser={isActiveUser}>
        <S.Index isSystem={isSystem} isActiveUser={isActiveUser}>
          {(message.index + 1).toLocaleString('de-CH')}
        </S.Index>
        <S.Wrapper>
          {!isSystem && !sameAuthorAsPrevious && (
            <S.Author color={color}>{message.author}</S.Author>
          )}
          {formattedMessage.attachment ? (
               <Linkify componentDecorator={Link}>
                 <Suspense fallback={`Loading ${formattedMessage.attachment.fileName}...`}>
              <Attachment fileName={formattedMessage.attachment.fileName} />
            </Suspense>
               <S.Message>{formattedMessage.message}</S.Message>
             </Linkify>
           
          ) : (
            <Linkify componentDecorator={Link}>
              <S.Message>{formattedMessage.message}</S.Message>
            </Linkify>
          )}
        </S.Wrapper>
        {!isSystem && (
          <S.Date dateTime={dateTime}>
            {new Intl.DateTimeFormat('default', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            }).format(message.date)}
          </S.Date>
        )}
      </S.Bubble>
    </S.Item>
  );
}

export default Message;
